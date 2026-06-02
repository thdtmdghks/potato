import { test, expect } from "@playwright/test";

test.describe("후기 수명 주기", () => {
  // TODO: storageState 세션 설정 후 활성화
  test.skip("관리자 리뷰 관리 페이지에서 초대 링크를 생성할 수 있다", async ({ page }) => {
    await page.goto("/admin/reviews");

    const generateBtn = page.getByRole("button", { name: /링크 생성/ });
    await generateBtn.click();

    const linkText = page.locator("p.font-mono");
    await expect(linkText).toBeVisible();
    const link = await linkText.textContent();
    expect(link).toContain("/reviews/write?id=");
  });

  test("후기 작성 페이지에 비로그인으로 접근하면 로그인 유도 화면이 표시된다", async ({ page }) => {
    await page.goto("/reviews/write?id=019e4ee9-dd41-7000-9020-304050607080");

    const authCard = page.getByText("본인 인증이 필요합니다");
    await expect(authCard).toBeVisible();
  });

  test("마이페이지에 비로그인으로 접근하면 로그인 유도 화면이 표시된다", async ({ page }) => {
    await page.goto("/reviews/my");

    const authCard = page.getByText("마이페이지 접근 제한");
    await expect(authCard).toBeVisible();
  });

  test("메인 페이지에 승인된 후기가 있으면 후기 섹션이 표시된다", async ({ page }) => {
    await page.goto("/");

    const reviewSection = page.getByText("고객 시공 후기");
    const isVisible = await reviewSection.isVisible();

    if (isVisible) {
      const carousel = page.locator("section:has-text('고객 시공 후기') [class*='rounded-2xl']");
      await expect(carousel.first()).toBeVisible();
    }
  });
});
