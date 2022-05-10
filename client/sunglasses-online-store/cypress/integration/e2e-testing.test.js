describe("Seller modifying items", () => {
  it("The seller should  sign in and add or edit some items and then sign out", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.get('[placeholder="Email"]').type("seller@email.com");
    cy.get('[placeholder="Password"]').type("qwAS12!@");
    cy.get('button:contains("Sign In")').click();
    //waiting for the items page to load
    cy.contains("Items");
    //search for the test items to check if there are anyone
    cy.get('[placeholder="Search"]').type("sunglasses test item");
    cy.get(".fa-search").click();
    cy.wait(5000);
    //check if the items already exists to edit them otherwise add new items
    cy.get("body").then(() => {
      let $items = Cypress.$(':contains("sunglasses test item")');

      //test items are already available in the database no need to create new items
      if ($items.length > 0) {
        cy.get('[placeholder="Change Quantity"]').type("10");
        cy.get("button:contains('Update')").click();
        cy.contains("Items successfully updated");
      }

      //the items are not available at all so the seller need to add new items
      else {
        cy.contains("Add New Item").click();
        //waiting for the Add new item page to load
        cy.contains("Add New Sunglasses Item");
        //adding the first item
        cy.get('[placeholder="Name"]').type("sunglasses test item 1");
        cy.get('[placeholder="Brand"]').type("test");
        cy.get('[placeholder="Size"]').type("50");
        cy.get('[placeholder="Color"]').type("gold");
        cy.get('[placeholder="Price"]').type("250");
        cy.get('[placeholder="Quantity"]').type("10");
        cy.get('input[type="file"]').attachFile("example-image.jpg");
        cy.contains("Add New Item").click();
        cy.contains("Item successfully added");
        //adding the second item
        cy.get('[placeholder="Color"]').clear().type("silver");
        cy.contains("Add New Item").click();
        cy.contains("Item successfully added");
        //adding the third item
        cy.get('[placeholder="Color"]').clear().type("gold");
        cy.get('[placeholder="Size"]').clear().type("40");
        cy.contains("Add New Item").click();
        cy.contains("Item successfully added");
        //adding the fourth item
        cy.get('[placeholder="Name"]').clear().type("sunglasses test item 2");
        cy.get('[placeholder="Size"]').clear().type("50");
        cy.contains("Add New Item").click();
        cy.contains("Item successfully added");
        //adding the 5th item
        cy.get('[placeholder="Name"]').clear().type("sunglasses test item 3");
        cy.contains("Add New Item").click();
        cy.contains("Item successfully added");
      }
    });
    cy.contains("Sign Out").click();
    //waiting for the sign out process to complete
    cy.contains("Sign In");
  });
});
describe("The user adding items to the shopping cart", () => {
  it("The non signed in user should search for items and add some to the shopping cart", () => {
    cy.visit("http://localhost:3000/home");
    //search for the items
    cy.get('[placeholder="Search"]').type("sunglasses test item");
    cy.get(".fa-search").click();
    //clicking the needed item
    cy.contains("sunglasses test item 1").click();
    //waiting for the view item page to load
    cy.contains("sunglasses test item 1");
    //selecting an item with color gold and size 40 and quantity 2 and add it to the shopping cart
    cy.contains("gold").click();
    cy.get("label:contains('40')").click();
    cy.get("#quantity").type("2");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
    //selecting an item with color silver and size 50 and quantity 10 and add it to the shopping cart
    cy.contains("silver").click();
    cy.get("#quantity").clear().type("1");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
  });
});
describe("The user making orders", () => {
  it("The user should sign in and if it failed the user should sign up and sign in again", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.get('[placeholder="Email"]').type("test123@email.com");
    cy.get('[placeholder="Password"]').type("Aq!7zxcv");
    cy.get('button:contains("Sign In")').click();
    cy.wait(5000);
    //check if there is no account with that info by checking if an error appears
    //if Error text appear then the user will sign up and then sign in again
    cy.get("body").then(() => {
      let $el = Cypress.$(':contains("Error: User not found")');

      //if Error text is found then the user will sign up
      if ($el.length > 0) {
        //sign up
        cy.contains("Sign Up").click();
        //wait for the sign up page to load
        cy.contains("Sign Up");
        //filling the info
        cy.get('[placeholder="First Name"]').type("Test");
        cy.get('[placeholder="Last Name"]').type("Test");
        cy.get('[placeholder="Email"]').type("test123@email.com");
        cy.get('[placeholder="Password"]').type("Aq!7zxcv");
        cy.get('[placeholder="Confirm Password"]').type("Aq!7zxcv");
        cy.get('select[data-testid="code"]').select("+355");
        cy.get('[placeholder="Phone"]').type("4654144645");
        cy.get('select[data-testid="country"]').select("Albania");
        cy.get('[placeholder*="State"]').type("state");
        cy.get('[placeholder="City"]').type("city");
        cy.get('[placeholder="Street"]').type("street");
        cy.get('[placeholder*="Apt"]').type("apt address");
        cy.get('[placeholder*="ZIP"]').type("1234");
        cy.get('button:contains("Sign Up")').click();
        cy.contains("Account successfully created");

        //sign in again
        //wait for the sign in page to load
        cy.contains("Welcome to Sunglasses Online Store");
        //fill the info
        cy.get('[placeholder="Email"]').type("test123@email.com");
        cy.get('[placeholder="Password"]').type("Aq!7zxcv");
        cy.get('button:contains("Sign In")').click();
        //wait for the user home page to load
        cy.contains("Sign Out");
      }
    });
  });
  it("The user should verify email, verify phone, order some items, and then sign out", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.get('[placeholder="Email"]').type("test123@email.com");
    cy.get('[placeholder="Password"]').type("Aq!7zxcv");
    cy.get('button:contains("Sign In")').click();
    //wait for the user home page to load
    cy.contains("Sign Out");
    //search for the items
    cy.get('[placeholder="Search"]').type("sunglasses test item");
    cy.get(".fa-search").click();
    //clicking the needed item
    cy.contains("sunglasses test item 1").click();
    //waiting for the view item page to load
    cy.contains("sunglasses test item 1");
    //selecting an item with color gold and size 40 and quantity 2 and add it to the shopping cart
    cy.contains("gold").click();
    cy.get("label:contains('40')").click();
    cy.get("#quantity").type("2");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
    //selecting an item with color silver and size 50 and quantity 10 and add it to the shopping cart
    cy.contains("silver").click();
    cy.get("#quantity").clear().type("1");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
    //going to account settings
    cy.get(".fa-ellipsis-h").click();
    cy.contains("Account Settings").click();
    //verifying email
    cy.get("a.list-group-item:contains('Verify Your Email')", {
      timeout: 10000,
    }).click();
    cy.contains("Verify Email", { timeout: 10000 }).click();
    cy.contains("Email successfully verified");
    //verifying phone
    cy.get("a.list-group-item:contains('Verify Your Phone')").click();
    cy.contains("Verify Phone", { timeout: 10000 }).click();
    cy.contains("Phone successfully verified");
    //ordering the shopping cart items
    cy.get(".fa-shopping-cart").click();
    //wait for cart page to load
    cy.contains("Shopping Cart");
    //making the orders
    cy.contains("Proceed Order").click();
    cy.wait(5000);
    cy.getWithinIframe('[name="cardnumber"]').type("4242424242424242");
    cy.getWithinIframe('[name="exp-date"]').type("1232");
    cy.getWithinIframe('[name="cvc"]').type("987");
    cy.getWithinIframe('[name="postal"]').type("12345");
    cy.contains("Pay").click();
    cy.contains("Payment succeeded", { timeout: 10000 });
    //sign out
    cy.contains("Sign Out").click();
    //wait for the sign out process to be completed
    cy.contains("Sign In");
  });
});
describe("The seller editing orders", () => {
  it("The seller sign in and search for some orders and edit them and then sign out", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.get('[placeholder="Email"]').type("seller@email.com");
    cy.get('[placeholder="Password"]').type("qwAS12!@");
    cy.get('button:contains("Sign In")').click();
    //go to orders page
    cy.contains("Orders").click();
    //wait for the orders page to load
    cy.contains("Update Orders");
    //search for the needed orders
    cy.get('[placeholder="Search"]').type("sunglasses test item");
    cy.get(".fa-search").click();
    cy.wait(5000);
    //edit the orders
    cy.get('[placeholder="Change Shipment ID"]').type("1234");
    cy.get('[placeholder="Change Status"]').type("Delivered");
    cy.get("button:contains('Update')").click();
    cy.contains("Orders successfully updated");
    //sign out
    cy.contains("Sign Out").click();
    //wait for the sign out to be completed
    cy.contains("Sign In");
  });
});
