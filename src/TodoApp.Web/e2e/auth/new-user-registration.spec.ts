import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { VerifyCodePage } from '../pages/verify-code.page';
import { CreateAccountPage } from '../pages/create-account.page';
import { DashboardPage } from '../pages/dashboard.page';
import { MailDevHelper } from '../support/maildev-helper';

test.describe('New User Registration', () => {
  let loginPage: LoginPage;
  let verifyPage: VerifyCodePage;
  let createAccountPage: CreateAccountPage;
  let dashboardPage: DashboardPage;
  let maildevHelper: MailDevHelper;

  test.beforeEach(async ({ page, context }) => {
    // Set a flag to disable MSW before any scripts run
    await context.addInitScript(() => {
      // This runs before any page scripts
      (window as any).__PLAYWRIGHT_TEST__ = true;
    });

    loginPage = new LoginPage(page);
    verifyPage = new VerifyCodePage(page);
    createAccountPage = new CreateAccountPage(page);
    dashboardPage = new DashboardPage(page);
    maildevHelper = new MailDevHelper(page);
  });

  test('should complete full registration flow', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const displayName = 'Test User';
    const teamName = `Team ${Date.now()}`;

    // Step 1: Submit email on login page
    await loginPage.goto();
    await loginPage.submitEmail(testEmail);

    // Step 2: Verify navigation to verify code page
    await expect(page).toHaveURL(/\/verify/);
    await expect(await verifyPage.isDisplayingEmail(testEmail)).toBeTruthy();

    // Step 3: Retrieve verification code from MailDev
    // Wait a moment for email to arrive
    await page.waitForTimeout(2000);
    const code = await maildevHelper.getLatestVerificationCode(testEmail);
    expect(code).toMatch(/^\d{6}$/);

    // Step 4: Enter verification code
    await verifyPage.enterCode(code);

    // Step 5: Verify navigation to create account page
    await expect(page).toHaveURL(/\/register/);

    // Step 6: Complete registration
    await createAccountPage.fillForm({ displayName, teamName });
    await createAccountPage.submit();

    // Step 7: Verify successful login and navigation to dashboard
    // Wait for navigation and check where we ended up
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/');
    await expect(await dashboardPage.isLoggedIn()).toBeTruthy();
  });
});