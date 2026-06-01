import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types";
import { logWarn, logError } from "./logger";

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_UNAUTHORIZED = 401;
const RETRY_MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 300;

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let attempts = 0;
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let lastErrorBody: Record<string, unknown> | null = null;
  let encounteredClockSkew = false;
  let lastResponse: Response | null = null;

  while (attempts < RETRY_MAX_ATTEMPTS) {
    attempts++;
    try {
      const response = await fetch(input, init);
      lastResponse = response;

      if (
        response.status === HTTP_STATUS_UNAUTHORIZED ||
        response.status === HTTP_STATUS_BAD_REQUEST
      ) {
        const clonedResponse = response.clone();
        try {
          const body = await clonedResponse.json();
          if (body && typeof body === "object") {
            const message = String(body.message || body.error_description || "").toLowerCase();
            if (message.includes("issued at future") || message.includes("issued in the future")) {
              encounteredClockSkew = true;
              lastErrorBody = body;
              console.warn(
                `[SUPABASE FETCH RETRY] Clock skew detected (${body.message || body.error_description}). Retrying attempt ${attempts}/${RETRY_MAX_ATTEMPTS}...`,
              );
              await delay(attempts * RETRY_DELAY_MS);
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
          `Clock skew error (JWT issued at future) resolved on retry attempt ${attempts}/${RETRY_MAX_ATTEMPTS}`,
          {
            url: input.toString(),
            attemptsRequired: attempts,
            originalError: lastErrorBody,
          },
        );
      }

      return response;
    } catch (err) {
      if (attempts >= RETRY_MAX_ATTEMPTS) {
        if (encounteredClockSkew) {
          logError(
            "SupabaseClient.customFetch",
            new Error(
              `Clock skew retry exhausted after ${RETRY_MAX_ATTEMPTS} attempts: ${err instanceof Error ? err.message : String(err)}`,
            ),
            {
              url: input.toString(),
              totalAttempts: RETRY_MAX_ATTEMPTS,
              lastError: err,
            },
          );
        }
        throw err;
      }
      await delay(attempts * RETRY_DELAY_MS);
    }
  }

  // If we reach here, all attempts failed with clock skew error.
  if (encounteredClockSkew && lastResponse) {
    logError(
      "SupabaseClient.customFetch",
      new Error(
        `Clock skew retry exhausted after ${RETRY_MAX_ATTEMPTS} attempts. Last response status: ${lastResponse.status}`,
      ),
      {
        url: input.toString(),
        totalAttempts: RETRY_MAX_ATTEMPTS,
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
