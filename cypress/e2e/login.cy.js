describe("Timesheet app", () => {
  // beforeEach(() => {
  //   cy.visit("/pc");
  // });

  beforeEach(() => {
    cy.visit("/pc");
    cy.fixture("loginCred").as("cred");
  });

  // Verifying the URL
  it("Verify the URL", () => {
    cy.url().should("include", "/pc");
  });

  // Verifying the Title
  it("Verify the title", () => {
    cy.get("@cred").then((cred) => {
      cy.title().should("eq", cred.pageTitle);
    });
  });

  // Verifying header is visible
  it("Verify the header is visible", () => {
    cy.get("header").should("be.visible");
  });

  // Verifying the logo is visible in the header
  it("Verify the logo is visible in the header", () => {
    cy.get("header").should("be.visible"); // Ensure header is visible
    cy.get("header .logo").should("be.visible"); // Ensure logo is visible within header
  });

  // Verifying the logo is correct
  it("Verify logo is correct", () => {
    cy.get(".logo").should("be.visible");
    // Check that the logo image has a src attribute
    cy.get(".logo img").should("have.attr", "src");
  });

  // Verifying the logo is clickable
  it("Verify logo is clickable", () => {
    cy.get(".logo").should("be.visible");
    // Try clicking the logo and wait for potential navigation (optional)
    cy.get(".logo").click({ waitForNavigation: true }); // Click with navigation wait

    // OR (if navigation is not expected)
    // cy.get('.logo').click();  // Simple click
  });

  // Verifying the Email field is visible
  it("Verify Email field is visible", () => {
    cy.get("#inputEmail").should("be.visible");
  });

  // Verifying the Password field is visible
  it("Verify Password field is visible", () => {
    // cy.get('#inputPassword').should('be.visible')
    cy.xpath('//*[@id="inputPassword"]').should("be.visible");
  });

  // Verifying the Eye icon is visible
  it("Verify the Eye icon is visible", () => {
    cy.get(".far").should("be.visible");
  });

  // Verifying the Eye icon is clickable
  it("Verify the eye icon is clickable", () => {
    cy.get(".far").click().should("have.class", "far toggle-password fa-eye");
  });

  // Verifying Email input field is clickable
  it("Verify Email input field is clickable", () => {
    cy.get("#inputEmail").should("be.visible").and("be.enabled");
  });

  // Verifying Password input field is clickable
  it("Verify Password input field is clickable", () => {
    cy.get("#inputEmail").should("be.visible").and("be.enabled");
  });

  // Verifying forgot my password is visible and clickable
  it.skip("Verify forgot my password is visible and clickable", () => {
    cy.get(".card-footer>p>a").should("be.visible").and("be.enabled");
  });

  // Verifying on clicking I forgot my password should navigate to reset password page
  it.skip("Verify click on forgot my password should navigate to reset password page", () => {
    cy.get(".card-footer>p>a").click();
    cy.url().should("include", "/password/reset");
  });

  // Verifying the login page image
  it("Verify login page image visibility", () => {
    cy.get(".o-cover").should("be.visible");
    cy.get(".o-cover")
      .should("have.attr", "src")
      .and(
        "eq",
        "https://stgtimeapp.rubico.dev/images/landingpage/login-img.png"
      );
  });

  // Verifying the labels are correct and visible
  it("Verify labels are correct and visible", () => {
    cy.get("@cred").then((cred) => {
      cy.get('label[for="mail"]').should("be.visible");
      cy.get(":nth-child(2) > label").should("have.text", cred.emailLabel);
      cy.xpath('//label[contains(text(),"Password")]').should("be.visible");
      cy.get('label[for="pwd"]').should("have.text", cred.passwordLabel);
    });
  });

  // Verifying the placeholders are visible
  it("Verify the placeholders are visible", () => {
    cy.get("#inputEmail").should("be.visible");
    cy.get("#inputPassword").should("be.visible");
  });

  // Verifying the placeholders text
  it("Verify placeholder text in login inputs", () => {
    cy.get("@cred").then((cred) => {
      cy.get("#inputEmail").should(
        "have.attr",
        "placeholder",
        cred.placeholderEmail
      );
      cy.get("#inputPassword").should(
        "have.attr",
        "placeholder",
        cred.placeholderPassword
      );
    });
  });

  // Verifying Logging in with correct credentials
  it("Verify when Login with Valid Cred", () => {
    let email = Cypress.env("email");
    let password = Cypress.env("password");
    // Type the email and password from the get folder
    cy.login(email, password);
  });

  // Verifying Login with empty input fields
  it("Verify when Login with empty input fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get("@cred").then((cred) => {
      cy.get(".alert>ul>:nth-child(1)").contains(cred.emptyEmailValidation);
      cy.get(".alert>ul>:nth-child(2)").contains(cred.emptyPasswordValidation);
    });
  });

  // Verifying Correct Username, Invalid Password
  it("Verify when Email is correct but invalid password", () => {
    cy.get("@cred").then((cred) => {
      cy.login(cred.validEmail, cred.demoPass);

      cy.get(".alert")
        .should("be.visible")
        .contains(cred.invalidCredValidation);
    });
  });

  // Verifying Invalid Username, Correct Password
  it("Verify when Email is invalid but correct password", () => {
    cy.get("@cred").then((cred) => {
      cy.login(cred.demoEmail, cred.demoPass);
      cy.get(".alert")
        .should("be.visible")
        .contains(cred.invalidCredValidation);
    });
  });

  // Verifying email or password having spaces
  it.only("Verify email or password having spaces", () => {
    cy.get("@cred").then((cred) => {
      cy.login(cred.emailWithSpaces, cred.passWithSpaces);
      cy.get(".alert")
        .should("be.visible")
        .contains(cred.invalidCredValidation);
    });
  });

  // Verifying login with username having no domain
  it("Verify login with username having no domain", () => {
    cy.get("@cred").then((cred) => {
      cy.login(cred.noDomainEmail, cred.noDomainPass);
      cy.get(".alert")
        .should("be.visible")
        .contains(cred.invalidCredValidation);
    });
  });

  // Verifying the navigation between form fields using the tab key
  it("Verify navigation between form fields using the tab key", () => {
    cy.visit("/pc");
    // Type email and press tab
    cy.get("#inputEmail")
      .type("abcd@efgh")
      .trigger("keydown", { keyCode: 9, which: 9 });

    // Verify focus is on the email field
    cy.get("input#inputEmail.form-control").should(
      "have.attr",
      "placeholder",
      "Your Email"
    );

    // Type password and press tab
    cy.get("#inputPassword")
      .type("abcd")
      .trigger("keydown", { keyCode: 9, which: 9 });
    cy.get("input#inputPassword.form-control").should(
      "have.attr",
      "placeholder",
      "Your Password"
    );
    cy.get(".cta-btn").should("have.attr", "type", "submit");
  });

  // Verifying maximum limit of password input field
  it("Verify maximum limit of password input field", () => {
    cy.get("#inputPassword").as("passwordField");

    // Enter a password that exceeds the character limit
    cy.get("@passwordField").type("a".repeat(100)); // Adjust the length as needed

    // Verify that the password field contains only the allowed number of characters
    cy.get("@passwordField").should("have.value", "a".repeat(100)); // Assuming the limit is 100 characters
  });

  // Verifying if the user entered minimum characters required in the password field
  it("Verify password entered has minimum 6 characters in the password field", () => {
    cy.get("@cred").then((cred) => {
      cy.login(cred.demoEmail, cred.minLenPass);
      cy.contains(".alert", cred.minLengthPasswordValidation).should(
        "be.visible"
      );
      cy.get(".error-message").should("not.exist"); // No error message should be displayed
    });
  });

  it("Verify redirect on unauthorized dashboard access", () => {
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });

  // Verifying redirect on unauthorized dashboard access after logging in and then loggin out
  it("Verify redirect on unauthorized dashboard access after logging in and then loggin out", () => {
    cy.visit("/pc");
    let email = Cypress.env("email");
    let password = Cypress.env("password");
    cy.login(email, password);
    cy.get(".new-billing-account > #dropdownMenuButton").click();
    // cy.xpath('/html/body/main/div/div[1]/div[3]/div/a').click
    cy.get(".new-billing-account > .dropdown-menu > .dropdown-item").click();

    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });

  // Verifying session timeout functionality
  it.skip("should expire session after inactivity", () => {
    cy.visit(
      "https://demos.telerik.com/aspnet-ajax/notification/examples/sessiontimeout/defaultvb.aspx?skin=BlackMetroTouch"
    );

    cy.wait(60000);
    cy.url().should("include", "login.aspx");
  });

  it("Verify that the session should expire cookies after logout", () => {
    let email = Cypress.env("email");
    let password = Cypress.env("password");
    cy.login(email, password);

    // Getting the session cookie value before logout
    cy.getCookie("laravel_session").then((cookie) => {
      const sessionBeforeLogout = cookie ? cookie.value : null;

      cy.get(".new-billing-account > #dropdownMenuButton").click();
      cy.get(".new-billing-account > .dropdown-menu > .dropdown-item").click();

      cy.visit("/dashboard");
      cy.url().should("include", "/login");
      // Verify that the session cookie no longer exists
      cy.getCookies().should("not.include", "laravel_session");
    });
  });
});