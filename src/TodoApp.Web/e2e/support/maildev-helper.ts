import { Page } from '@playwright/test';

export class MailDevHelper {
  private page: Page;
  private maildevUrl = 'http://localhost:1090';

  constructor(page: Page) {
    this.page = page;
  }

  async getLatestVerificationCode(email: string): Promise<string> {
    const mailPage = await this.page.context().newPage();
    await mailPage.goto(this.maildevUrl);

    // Wait for emails to load
    await mailPage.waitForSelector('.email-item', { timeout: 5000 });

    // Find email by recipient (MailDev shows emails newest first)
    const emailRow = await mailPage.locator(`.email-item:has-text("${email}")`).first();
    await emailRow.click();

    // Wait for email content iframe
    await mailPage.waitForSelector('.email-content iframe');
    // Select the first iframe which contains the HTML content
    const frame = mailPage.frameLocator('.email-content iframe').first();

    // Extract code from styled h1 element
    const codeElement = await frame.locator('h1[style*="monospace"]');
    const code = await codeElement.textContent();

    await mailPage.close();
    return code?.trim() || '';
  }
}