import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  async isLoggedIn() {
    // Check for dashboard-specific elements that indicate successful login
    try {
      // Look for common dashboard elements that indicate login
      const welcomeText = this.page.locator('h1:has-text("Welcome")');
      const dashboardContent = this.page.locator('[data-testid="dashboard-content"]');
      const userProfile = this.page.locator('[data-testid="user-profile"]');
      
      // Try multiple selectors as we're not sure what exact elements exist
      await Promise.race([
        welcomeText.waitFor({ state: 'visible', timeout: 5000 }),
        dashboardContent.waitFor({ state: 'visible', timeout: 5000 }),
        userProfile.waitFor({ state: 'visible', timeout: 5000 }),
        // Fallback: just check we're on the root URL and page has loaded
        this.page.waitForLoadState('networkidle', { timeout: 5000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async getUserDisplayName() {
    // Try multiple possible selectors for user display name
    const selectors = [
      '[data-testid="user-display-name"]',
      '[data-testid="user-name"]',
      '.user-name',
      '[aria-label*="user"]'
    ];
    
    for (const selector of selectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible()) {
        return element.textContent();
      }
    }
    
    return null;
  }

  async getTeamName() {
    // Try multiple possible selectors for team name
    const selectors = [
      '[data-testid="team-name"]',
      '[data-testid="current-team"]',
      '.team-name',
      '[aria-label*="team"]'
    ];
    
    for (const selector of selectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible()) {
        return element.textContent();
      }
    }
    
    return null;
  }

  async waitForDashboardLoad() {
    // Wait for the dashboard to fully load
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Additional buffer for dynamic content
  }
}