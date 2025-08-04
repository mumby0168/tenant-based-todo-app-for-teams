import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class TodoListsPage extends BasePage {
  /**
   * Navigate to the Todo Lists page
   */
  async goto() {
    await this.page.goto('/lists');
    await this.waitForListsLoad();
  }

  /**
   * Navigate to lists page via sidebar navigation
   */
  async navigateViaSidebar() {
    const sideBarButton = this.page.getByTestId('sidebar-todo-lists');
    // wait for visible to ensure sidebar is open
    await sideBarButton.waitFor({ state: 'visible', timeout: 5000 });

    await sideBarButton.click();
    await this.waitForListsLoad();
  }

  /**
   * Wait for the lists page to fully load
   */
  async waitForListsLoad() {
    // Wait for the API call to complete
    await this.waitForApiResponse('/api/v1/lists');
    // Wait for the page content to be ready
    await this.page.waitForLoadState('networkidle');
    // Wait for the main heading to be visible
    await this.page.waitForSelector('h1:has-text("Todo Lists")', { state: 'visible' });
  }

  /**
   * Check if the create FAB button is visible
   */
  async isCreateFabVisible(): Promise<boolean> {
    const fab = this.page.locator('button[aria-label="create list"]');
    return await fab.isVisible();
  }

  /**
   * Click the create FAB button
   */
  async clickCreateFab() {
    const fab = this.page.locator('button[aria-label="create list"]');
    await fab.click();
  }


  /**
   * Verify all empty state components are present and correct
   */
  async verifyEmptyState() {
    // Verify main heading
    await expect(this.page.locator('h1:has-text("Todo Lists")')).toBeVisible();

    // Verify empty state icon (FormatListBulleted icon)
    const icon = this.page.locator('svg').first(); // MUI icons render as SVG
    await expect(icon).toBeVisible();

    // Verify empty state heading
    await expect(this.page.locator('h5:has-text("No lists yet!")')).toBeVisible();

    // Verify empty state description
    await expect(this.page.locator('text=Create your first todo list to get started with your team')).toBeVisible();

    // Verify FAB button
    await expect(this.page.locator('button[aria-label="create list"]')).toBeVisible();
  }
}