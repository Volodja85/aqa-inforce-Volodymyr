export class RentRoomsPage {
  constructor(page) {
    this.page = page;
    this.useReserver = page.locator("#doReservation");
    this.userFirstname = page.locator('input[placeholder="Firstname"]');
    this.userLastname = page.getByPlaceholder("Lastname");
    this.userEmail = page.getByPlaceholder("Email");
    this.userPhone = page.getByPlaceholder("Phone");
    this.userReserveNow = page.getByRole("button", { name: "Reserve Now" });
  }

  async ClickUseCalendar(startDay, endDay) {
    const start = this.page.getByRole("button", { name: String(startDay) });
    const end = this.page.getByRole("button", { name: String(endDay) });

    await start.scrollIntoViewIfNeeded();
    const a = await start.boundingBox();
    const b = await end.boundingBox();
    if (!a || !b) throw new Error("Calendar day buttons not visible");

    await this.page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, {
      steps: 10,
    });
    await this.page.mouse.up();
  }

  async ClickUseReserver() {
    await this.useReserver.click();
  }

  async typeUserFirstname(firstname) {
    await this.userFirstname.fill(firstname);
  }
  async typeUserLastname(lastname) {
    await this.userLastname.fill(lastname);
  }
  async typeUserEmail(email) {
    await this.userEmail.fill(email);
  }
  async typeUserPhone(phone) {
    await this.userPhone.fill(phone);
  }
  async ClickUseReserveNow() {
    await this.userReserveNow.click();
  }
}
