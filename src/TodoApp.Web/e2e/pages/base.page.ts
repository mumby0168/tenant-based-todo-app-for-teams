import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async waitForApiResponse(urlPattern: string, status = 200) {
    return this.page.waitForResponse(
      response => response.url().includes(urlPattern) && response.status() === status,
      { timeout: 10000 }
    );
  }

  async waitForNavigation(url: string) {
    await this.page.waitForURL(url, { timeout: 10000 });
  }
}