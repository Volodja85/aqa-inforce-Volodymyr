import { test, expect } from "@playwright/test";
export class BasePage {
  constructor(page, url) {
    this.url = url;
    this.page = page;
  }
  async visit() {
    await this.page.goto(this.url);
  }
}
