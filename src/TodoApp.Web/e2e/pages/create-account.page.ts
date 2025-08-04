import { BasePage } from './base.page';

export class CreateAccountPage extends BasePage {
  private displayNameInput = this.page.locator('input[name="displayName"]');
  private teamNameInput = this.page.locator('input[name="teamName"]');
  private createButton = this.page.getByRole('button', { name: 'Create Account' });

  async fillForm(data: { displayName: string; teamName: string }) {
    await this.displayNameInput.fill(data.displayName);
    await this.teamNameInput.fill(data.teamName);
  }

  async submit() {
    const responsePromise = this.waitForApiResponse('/auth/complete-registration');
    await this.createButton.click();
    await responsePromise;
    await this.waitForNavigation('/');
  }
}