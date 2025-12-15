import { AdminPage } from "./AdminPage";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByPlaceholder("Enter username");
    this.password = page.getByPlaceholder("Password");
    this.loginButton = page.locator("#doLogin");
  }

  async typeUsername(value) {
    await this.username.fill(value);
  }

  async typePassword(value) {
    await this.password.fill(value);
  }

  async clickLogin() {
    await this.loginButton.click();
    return new AdminPage(this.page);
  }
}
