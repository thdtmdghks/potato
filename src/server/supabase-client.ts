import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types";
import { logWarn, logError } from "./logger";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let attempts = 0;
  const maxAttempts = 3;
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let lastErrorBody: Record<string, unknown> | null = null;
  let encounteredClockSkew = false;
  let lastResponse: Response | null = null;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const response = await fetch(input, init);
      lastResponse = response;

      if (response.status === 401 || response.status === 400) {
        const clonedResponse = response.clone();
        try {
          const body = await clonedResponse.json();
          if (body && typeof body === "object") {
            const message = String(body.message || body.error_description || "").toLowerCase();
            if (message.includes("issued at future") || message.includes("issued in the future")) {
              encounteredClockSkew = true;
              lastErrorBody = body;
              console.warn(
                `[SUPABASE FETCH RETRY] Clock skew detected (${body.message || body.error_description}). Retrying attempt ${attempts}/${maxAttempts}...`,
              );
              await delay(attempts * 200); // Wait 200ms, 400ms...
              continue;
            }
          }
        } catch {
          // Not a JSON response, ignore
        }
      }

      // If we got here, request was either successful or a non-clock-skew error.
      if (encounteredClockSkew) {
        logWarn(
          "SupabaseClient.customFetch",
          `Clock skew error (JWT issued at future) resolved on retry attempt ${attempts}/${maxAttempts}`,
          {
            url: input.toString(),
            attemptsRequired: attempts,
            originalError: lastErrorBody,
          },
        );
      }

      return response;
    } catch (err) {
      if (attempts >= maxAttempts) {
        if (encounteredClockSkew) {
          logError(
            "SupabaseClient.customFetch",
            new Error(
              `Clock skew retry exhausted after ${maxAttempts} attempts: ${err instanceof Error ? err.message : String(err)}`,
            ),
            {
              url: input.toString(),
              totalAttempts: maxAttempts,
              lastError: err,
            },
          );
        }
        throw err;
      }
      await delay(attempts * 200);
    }
  }

  // If we reach here, all attempts failed with clock skew error.
  if (encounteredClockSkew && lastResponse) {
    logError(
      "SupabaseClient.customFetch",
      new Error(
        `Clock skew retry exhausted after ${maxAttempts} attempts. Last response status: ${lastResponse.status}`,
      ),
      {
        url: input.toString(),
        totalAttempts: maxAttempts,
        lastError: lastErrorBody,
      },
    );
  }

  return lastResponse || fetch(input, init);
};

export const createServerSupabase = () => {
  const url = process.env.SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient<Database>(url, serviceRoleKey, {
    global: {
      fetch: customFetch,
    },
  });
};
