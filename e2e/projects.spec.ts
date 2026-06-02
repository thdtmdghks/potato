import { test, expect } from "@playwright/test";

test.describe("시공사례 조회", () => {
  test("메인 페이지에 시공사례 캐러셀이 로딩된다", async ({ page }) => {
    await page.goto("/");
    const gallery = page.locator("section#gallery, section:has-text('시공사례')");
    await expect(gallery).toBeVisible();
  });

  test("갤러리 페이지에서 카테고리 필터가 동작한다", async ({ page }) => {
    await page.goto("/projects");

    // 카테고리 필터 링크 존재 확인
    const filterNav = page.locator("nav[aria-label='카테고리 필터']");
    await expect(filterNav).toBeVisible();

    // 첫 번째 카테고리 필터 클릭 (전체 제외)
    const firstFilter = filterNav.locator("a").nth(1);
    await firstFilter.click();

    // URL에 category 파라미터가 생겨야 함
    await expect(page).toHaveURL(/category=/);
  });

  test("시공사례 상세 페이지에서 제목과 사진이 로딩된다", async ({ page }) => {
    await page.goto("/projects");

    // 첫 번째 카드 클릭
    const firstCard = page.locator("li a[href^='/projects/']").first();
    await firstCard.click();

    // 상세 페이지 URL 형식 확인
    await expect(page).toHaveURL(/\/projects\/.+/);

    // 제목 존재
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // 이미지 존재
    const image = page.locator("img").first();
    await expect(image).toBeVisible();
  });
});
