import { BasePage } from './base.page';

export class VerifyCodePage extends BasePage {
  private getCodeInput(index: number) {
    return this.page.locator(`input[aria-label="Digit ${index + 1}"]`);
  }

  async enterCode(code: string) {
    // Enter digits one by one
    for (let i = 0; i < 6; i++) {
      await this.getCodeInput(i).fill(code[i]);
    }
    
    // Wait for auto-submit after 6th digit
    const responsePromise = this.waitForApiResponse('/auth/verify-code');
    await responsePromise;
  }

  async isDisplayingEmail(email: string) {
    // Wait for the email to be visible and return true/false
    try {
      await this.page.locator(`text=${email}`).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}