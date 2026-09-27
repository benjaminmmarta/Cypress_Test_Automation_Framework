# Master Test Plan: Cypress Test Automation Framework


### SCOPE

--- 

The automated test suite focuses on functional, end-to-end (E2E), and regression testing of the internal banking features and active user portals. Testing will be executed using JavaScript and Cypress using a Page Object Model (POM) architecture.

The scope is divided into the following target functional modules:

- **User Authentication**: Registration (/register.htm), Login via the sidebar, Logout session clearance, and "Forgot login info?" workflows.

- **Account Services**: Open New Account, Account Overview (balance checking and transaction history parsing), Transfer Funds UI, and Bill Pay validation.

- **Data Input Validation**: Form fields, boundary value assertions, and error-state visibility for missing or malformed inputs.

- **Administrative Controls**: Verifying the Admin Page functionality to toggle background services or initialize database states.


### OUT-OF-SCOPE

--- 

The following links and modules will not be included in the automation suite due to dead links or external domain redirects.

- **Header Navigation**: "Solutions"(not clickable/broken UI element)

- **External Parasoft Domains**: "Products (/products/), 
"Locations" (/solutions/), "Forum" (forums.parasoft.com/)

- **SiteMap**: All Account Services Liks mapped under the sctructural Site Map page.


### ENVIRONMENT & TOOLS

--- 

- **Automation Tool**: Cypress (Latest stable version)

- **Language**: JavaScript (ES6+)

- **SUT (System Under Test)**: "https://parabank.parasoft.com/parabank/index.htm" 

- **Browsers Targeted**: Electron (headless for local CLI speed), Chrome, and Edge (headed for validation)

- **CI/CD Pipeline**: GitHub Actions Workflow. The suite will run automatically on every code push or pull request to the main repository branch, producing artifact reports upon failure.