import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private emailInput = this.page.locator('input[name="email"]');
  private continueButton = this.page.getByRole('button', { name: 'Continue' });
  private errorAlert = this.page.locator('[role="alert"]');

  async goto() {
    await this.page.goto('/login');
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    
    const responsePromise = this.waitForApiResponse('/auth/request-code');
    await this.continueButton.click();
    await responsePromise;
    
    await this.waitForNavigation('**/verify');
  }

  async getErrorMessage() {
    return this.errorAlert.textContent();
  }
}