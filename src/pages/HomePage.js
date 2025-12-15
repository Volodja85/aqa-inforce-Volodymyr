import { BasePage } from "./basePage.js";
import { LoginPage } from "./LoginPage.js";
import { RentRoomsPage } from "./RentRoomsPage.js";

export class HomePage extends BasePage {
  constructor(page, url) {
    super(page, url);
    this.AdminLink = page.getByRole("link", { name: "Admin", exact: true });
    this.bookNowButton = page.locator('a[href^="/reservation/2"]');
  }
  async clickAdminLink() {
    await this.AdminLink.click();
    return new LoginPage(this.page);
  }

  async clickBookNowButton() {
    //await this.bookNowButton.scrollIntoViewIfNeeded();
    await this.bookNowButton.click();
    return new RentRoomsPage(this.page);
  }
}
