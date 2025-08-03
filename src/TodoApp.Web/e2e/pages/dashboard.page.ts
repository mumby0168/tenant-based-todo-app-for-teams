import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  async isLoggedIn() {
    // Check for dashboard-specific elements that indicate successful login
    try {
      await this.page.locator('h1:has-text("Welcome back")').waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getUserDisplayName() {
    // Assuming there's a user display element
    return this.page.locator('[data-testid="user-display-name"]').textContent();
  }
}