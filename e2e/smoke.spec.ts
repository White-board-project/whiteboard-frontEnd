import { expect, type Page, test } from "@playwright/test";

const createHeading = "새 워크스페이스 만들기";
const joinHeading = "초대 코드로 참여하기";

async function expectWorkspaceAccessPage(page: Page) {
    await expect(page).toHaveURL("/workspace-access");
    await expect(
        page.getByRole("heading", { name: "화이트보드에서 협업을 시작하세요" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: createHeading })).toBeVisible();
    await expect(page.getByRole("heading", { name: joinHeading })).toBeVisible();
    await expect(
        page.getByText("비밀번호 없는 로그인을 위해 이메일로 매직 링크를 보내드립니다."),
    ).toBeVisible();
    await expect(page.getByText("© 2024 화이트보드. All rights reserved.")).toBeVisible();
    const footerNav = page.getByRole("navigation", { name: "푸터 링크" });

    await expect(footerNav.getByRole("link", { name: "개인정보 처리방침" })).toBeVisible();
    await expect(footerNav.getByRole("link", { name: "이용약관" })).toBeVisible();
    await expect(footerNav.getByRole("link", { name: "도움말" })).toBeVisible();
}

async function mockWorkspaceAccessApi(page: Page) {
    await page.route("**/workspace-access/create-verification", async (route) => {
        await route.fulfill({ contentType: "application/json", body: "{}" });
    });
    await page.route("**/workspace-access/join-verification", async (route) => {
        await route.fulfill({ contentType: "application/json", body: "{}" });
    });
    await page.route("**/workspace-access/resend-verification", async (route) => {
        await route.fulfill({ contentType: "application/json", body: "{}" });
    });
}

test("초기 페이지에서 워크스페이스 생성 인증 메일 대기 화면으로 전환된다", async ({ page }) => {
    await mockWorkspaceAccessApi(page);
    await page.goto("/");
    await expectWorkspaceAccessPage(page);

    const createForm = page
        .locator("form")
        .filter({ has: page.getByRole("heading", { name: createHeading }) });

    await createForm.getByLabel("워크스페이스 이름").fill("디자인 프로젝트");
    await createForm.getByLabel("이메일 주소").fill("designer@example.com");
    await createForm.getByRole("button", { name: "워크스페이스 생성 링크 받기" }).click();

    await expect(page).toHaveURL(/\/workspace-access\/verification-pending/);
    await expect(page.getByRole("heading", { name: "인증 메일을 발송했습니다." })).toBeVisible();
    await expect(page.getByText("designer@example.com")).toBeVisible();
    await expect(page.getByText("워크스페이스 생성 링크 발송 완료")).toBeVisible();
    await expect(page.getByText("받은 편지함을 확인하고 인증 링크를 클릭해 주세요.")).toBeVisible();

    await page.getByRole("button", { name: "메일 다시 보내기" }).click();

    await expect(page.getByRole("status")).toHaveText("인증 메일이 성공적으로 재전송되었습니다!");
});

test("초기 페이지에서 초대 코드 참여 인증 메일 대기 화면으로 전환된다", async ({ page }) => {
    await mockWorkspaceAccessApi(page);
    await page.goto("/workspace-access");
    await expectWorkspaceAccessPage(page);

    const joinForm = page
        .locator("form")
        .filter({ has: page.getByRole("heading", { name: joinHeading }) });

    await joinForm.getByLabel("초대 코드").fill("ABC-123");
    await joinForm.getByLabel("이메일 주소").fill("member@example.com");
    await joinForm.getByRole("button", { name: "워크스페이스 참여하기" }).click();

    await expect(page).toHaveURL(/\/workspace-access\/verification-pending/);
    await expect(page.getByRole("heading", { name: "인증 메일을 발송했습니다." })).toBeVisible();
    await expect(page.getByText("member@example.com")).toBeVisible();
    await expect(page.getByText("워크스페이스 참여 링크 발송 완료")).toBeVisible();
});
