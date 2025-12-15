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

✅ Covered Test Scenarios

Create Room via Admin API and verify on User API

Book Room via User API and verify booking on Admin API

Edit Room via Admin API and verify changes on User API

Delete Room via Admin API and verify removal on User API
