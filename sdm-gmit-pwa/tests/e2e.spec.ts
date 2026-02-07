import { test, expect } from '@playwright/test';

test('admin login and dashboard access', async ({ page }) => {
    await page.goto('/login');

    // Fill login form (assuming standard IDs or names, if not will fail and I'll debug)
    // Actually, I should check LoginPage.tsx to be sure about selectors.
    // But for now I'll use placeholders that are likely correct or I'll fix them.

    await page.getByPlaceholder('Email').fill('admin@gmit.org');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.getByText('Dashboard Overview')).toBeVisible();
});

test('member data page loads', async ({ page }) => {
    // Mock authentication if possible, or just login again
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('admin@gmit.org');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await page.goto('/admin/members');
    await expect(page.getByText('Data Jemaat')).toBeVisible();
});
