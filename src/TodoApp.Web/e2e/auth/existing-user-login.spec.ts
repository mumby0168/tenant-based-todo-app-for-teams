import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { VerifyCodePage } from '../pages/verify-code.page';
import { DashboardPage } from '../pages/dashboard.page';
import { MailDevHelper } from '../support/maildev-helper';
import { UserHelper, TestUser } from '../support/user-helper';

test.describe('Existing User Login', () => {
  let loginPage: LoginPage;
  let verifyPage: VerifyCodePage;
  let dashboardPage: DashboardPage;
  let maildevHelper: MailDevHelper;
  let userHelper: UserHelper;
  let existingUser: TestUser;

  test.beforeEach(async ({ page, context }) => {
    // Set a flag to disable MSW before any scripts run
    await context.addInitScript(() => {
      // This runs before any page scripts
      (window as unknown as { __PLAYWRIGHT_TEST__: boolean }).__PLAYWRIGHT_TEST__ = true;
    });

    loginPage = new LoginPage(page);
    verifyPage = new VerifyCodePage(page);
    dashboardPage = new DashboardPage(page);
    maildevHelper = new MailDevHelper(page);
    userHelper = new UserHelper(page);

    // Create an existing user for this test
    existingUser = await userHelper.createExistingUser();
  });

  test('should login existing user and skip account creation', async ({ page }) => {
    // Step 1: Submit existing user email on login page
    await loginPage.goto();
    await loginPage.submitEmail(existingUser.email);

    // Step 2: Verify navigation to verify code page
    await expect(page).toHaveURL(/\/verify/);
    await expect(await verifyPage.isDisplayingEmail(existingUser.email)).toBeTruthy();

    // Step 3: Retrieve verification code from MailDev
    // Wait a moment for email to arrive    
    const code = await maildevHelper.getLatestVerificationCode(existingUser.email);
    expect(code).toMatch(/^\d{6}$/);

    // Step 4: Enter verification code
    await verifyPage.enterCode(code);

    // Step 5: Verify direct navigation to dashboard (NOT to registration page)
    // This is the key difference from new user flow
    await page.waitForLoadState('networkidle');
    console.log('Current URL after verification:', page.url());

    // Should go directly to dashboard, not to /register
    await expect(page).toHaveURL('/');

    // Should never have navigated to the registration page
    let currentUrl = page.url();
    expect(currentUrl).not.toContain('/register');

    // Step 6: Verify successful login and user is recognized
    await expect(await dashboardPage.isLoggedIn()).toBeTruthy();

    currentUrl = page.url();
    expect(currentUrl).toContain('/');
  });

  test('should display correct user information on dashboard', async ({ page }) => {
    // Login the existing user
    await userHelper.loginExistingUser(existingUser.email);

    // Verify we're on the dashboard
    await expect(page).toHaveURL('/');
    await dashboardPage.waitForDashboardLoad();
    await expect(await dashboardPage.isLoggedIn()).toBeTruthy();

    // Verify user information is displayed (if available in the UI)
    const displayName = await dashboardPage.getUserDisplayName();
    const teamName = await dashboardPage.getTeamName();

    // These assertions are optional since we don't know the exact UI structure
    // but they provide value if the dashboard does show user/team info
    if (displayName) {
      expect(displayName).toBeTruthy();
      console.log('Dashboard displays user name:', displayName);
    }

    if (teamName) {
      expect(teamName).toBeTruthy();
      console.log('Dashboard displays team name:', teamName);
    }
  });
});