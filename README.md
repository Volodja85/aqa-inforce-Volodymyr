👤 Author

Volodymyr Zhemela
AQA Test Task – API Automation

AQA API Automation Tests

This project contains API automation tests for
👉 https://automationintesting.online/

The tests are written in JavaScript using Playwright Test and cover main Admin/User API flows.

🔧 Tech Stack

Node.js (v18+ recommended)

Playwright Test

JavaScript (ES Modules)

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/Volodja85/aqa-inforce-volodymyr.git
cd aqa-inforce-volodymyr

2️⃣ Install dependencies
npm install

3️⃣ Install Playwright browsers
npx playwright install

🔐 Authentication

Admin authentication token is generated via API and stored in:

tests/storage/token.json


The login test automatically saves the token before other tests run.

▶️ Run API Tests

Run all API tests:

npm run test:api


Or directly with Playwright:

npx playwright test tests/api

▶️ Run UI Tests

Run only UI tests:

npx playwright test tests/ui


Run a specific UI test:

npx playwright test tests/ui/booking.spec.js

✅ Covered Test Scenarios

Create Room via Admin API and verify on User API

Book Room via User API and verify booking on Admin API

Edit Room via Admin API and verify changes on User API

Delete Room via Admin API and verify removal on User API

🖥 UI Tests

The project also contains a basic UI test for room booking.

UI test location:

tests/ui/booking.spec.js


This test verifies the booking flow on the user interface of
👉 https://automationintesting.online/
