import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { VerifyCodePage } from '../pages/verify-code.page';
import { CreateAccountPage } from '../pages/create-account.page';
import { MailDevHelper } from './maildev-helper';

export interface TestUser {
  email: string;
  displayName: string;
  teamName: string;
}

export class UserHelper {
  private page: Page;
  private loginPage: LoginPage;
  private verifyPage: VerifyCodePage;
  private createAccountPage: CreateAccountPage;
  private maildevHelper: MailDevHelper;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.verifyPage = new VerifyCodePage(page);
    this.createAccountPage = new CreateAccountPage(page);
    this.maildevHelper = new MailDevHelper(page);
  }

  /**
   * Creates a new user by going through the full registration flow.
   * This user can then be used as an "existing user" in subsequent tests.
   */
  async createExistingUser(email?: string, displayName?: string, teamName?: string): Promise<TestUser> {
    const testUser: TestUser = {
      email: email || `test-existing-${Date.now()}@example.com`,
      displayName: displayName || `Test User ${Date.now()}`,
      teamName: teamName || `Team ${Date.now()}`
    };

    // Step 1: Submit email on login page
    await this.loginPage.goto();
    await this.loginPage.submitEmail(testUser.email);

    // Step 2: Verify navigation to verify code page
    await this.page.waitForURL(/\/verify/);

    // Step 3: Retrieve verification code from MailDev
    await this.page.waitForTimeout(2000);
    const code = await this.maildevHelper.getLatestVerificationCode(testUser.email);

    // Step 4: Enter verification code
    await this.verifyPage.enterCode(code);

    // Step 5: Complete registration (since this is a new user)
    await this.page.waitForURL(/\/register/);
    await this.createAccountPage.fillForm({ 
      displayName: testUser.displayName, 
      teamName: testUser.teamName 
    });
    await this.createAccountPage.submit();

    // Step 6: Wait for successful completion
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForURL('/');

    return testUser;
  }

  /**
   * Logs in an existing user by going through the email verification flow.
   * The user should already exist in the system.
   */
  async loginExistingUser(email: string): Promise<void> {
    // Step 1: Submit email on login page
    await this.loginPage.goto();
    await this.loginPage.submitEmail(email);

    // Step 2: Verify navigation to verify code page
    await this.page.waitForURL(/\/verify/);

    // Step 3: Retrieve verification code from MailDev
    await this.page.waitForTimeout(2000);
    const code = await this.maildevHelper.getLatestVerificationCode(email);

    // Step 4: Enter verification code
    await this.verifyPage.enterCode(code);

    // Step 5: Should navigate directly to dashboard (not registration)
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForURL('/');
  }
}