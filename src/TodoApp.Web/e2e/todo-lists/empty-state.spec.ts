import { expect, test } from '@playwright/test';
import { TodoListsPage } from '../pages/todo-lists.page';
import { TestUser, UserHelper } from '../support/user-helper';

test.describe('Todo Lists - Empty State', () => {
  let todoListsPage: TodoListsPage;
  let userHelper: UserHelper;
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    todoListsPage = new TodoListsPage(page);
    userHelper = new UserHelper(page);
  });

  test('should create user, navigate to lists page, and verify empty state', async ({ page }) => {
    // Step 1: Create and sign in a new user
    testUser = await userHelper.createExistingUser();

    // Step 2: Verify we're on the dashboard after registration
    await expect(page).toHaveURL('/');

    // Step 3: Navigate to lists page via sidebar
    await todoListsPage.navigateViaSidebar();

    // Step 4: Verify we're on the lists page
    await expect(page).toHaveURL('/lists');

    // Step 5: Verify empty state is displayed correctly
    await todoListsPage.verifyEmptyState();
  });
});