describe("Seller modifying items", () => {
  it("The seller should  sign in and add or edit some items and then sign out", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.contains("Email").type("seller@email.com");
    cy.contains("Password").type("qwAS12!@");
    cy.get('button:contains("Sign In")').click();
    //search for the test items to check if there are anyone
    cy.contains("Search").type("sunglasses test item");
    cy.get(".fa-search").click();
    //check if the items already exists to edit them otherwise add new items
    cy.get("body").then(() => {
      let $items = Cypress.$(':contains("sunglasses test item")');

      //test items are already available in the database no need to create new items
      if ($items.length > 0) {
        cy.contains("Change Quantity").type("10");
        cy.contains("Update").click();
      }

      //the items are not available at all so the seller need to add new items
      else {
        cy.contains("Add New Item").click();
        for (let i = 0; i < 5; i++) {
          if (i < 3) cy.contains("Name").type("sunglasses test item 1");
          else cy.contains("Name").type("sunglasses test item " + (i + 1));
          cy.contains("Brand").type("test");
          if (i === 2) cy.contains("Size").type("40");
          else cy.contains("Size").type("50");
          if (i === 1) cy.contains("Color").type("silver");
          else cy.contains("Color").type("gold");
          cy.contains("Price").type("250");
          cy.contains("Quantity").type("10");
          cy.fixture("example-image.jpg").then((fileContent) => {
            cy.get('input[type="file"]').attachFile({
              fileContent: fileContent.toString(),
              fileName: "example-image.jpg",
              mimeType: "image/jpg",
            });
          });
          cy.contains("Add New Item").click();
          cy.contains("Item successfully added");
        }
      }
    });
    cy.contains("Sign Out").click();
  });
});
describe("The user adding items to the shopping cart", () => {
  it("The non signed in user should search for items and add some to the shopping cart", () => {
    cy.visit("http://localhost:3000/home");
    //search for the items
    cy.contains("Search").type("sunglasses test item");
    cy.get(".fa-search").click();
    //clicking the needed item
    cy.contains("sunglasses test item 1").click();
    //selecting an item with color gold and size 40 and quantity 2 and add it to the shopping cart
    cy.contains("gold").click();
    cy.contains("40").click();
    cy.get("#quantity").type("2");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
    //selecting an item with color silver and size 50 and quantity 1 and add it to the shopping cart
    cy.contains("silver").click();
    cy.get("#quantity").type("1");
    cy.contains("Add to cart").click();
    cy.contains("Item added to the shopping cart");
  });
});
describe("The user order the orders in the shopping cart", () => {
  it("The user should sign in and if it failed the user should sign up and sign in again", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.contains("Email").type("test123@email.com");
    cy.contains("Password").type("Aq!7zxcv");
    cy.get('button:contains("Sign In")').click();
    //check if there is no account with that info by checking if an error appears
    //if Error text appear then the user will sign up and then sign in again
    cy.get("body").then(() => {
      let $el = Cypress.$(':contains("Error")');

      //if Error text is found then the user will sign up
      if ($el.length > 0) {
        //sign up
        cy.contains("Sign Up").click();
        cy.contains("First Name").type("Test");
        cy.contains("Last Name").type("Test");
        cy.contains("Email").type("test123@email.com");
        cy.contains("Password").type("Aq!7zxcv");
        cy.contains("Confirm Password").type("Aq!7zxcv");
        cy.get('select[data-testid="code"]').select("+355");
        cy.contains("Phone").type("4654144645");
        cy.get('select[data-testid="country"]').select("Albania");
        cy.contains("State").type("state");
        cy.contains("City").type("city");
        cy.contains("Street").type("street");
        cy.contains("Apt").type("apt");
        cy.contains("ZIP").type("1234");
        cy.get('button:contains("Sign Up")').click();
        cy.contains("Account successfully created");

        //sign in again
        cy.contains("Email").type("test123@email.com");
        cy.contains("Password").type("Aq!7zxcv");
        cy.get('button:contains("Sign In")').click();
      }
    });
  });
  it("The user should verify email, verify phone, order the shopping cart items, and then sign out", () => {
    //this automatically will redirect the already signed in user to the user's home page
    cy.visit("http://localhost:3000/sign_in");
    //going to account settings
    cy.get(".fa-ellipsis-h").click();
    cy.contains("Account Settings").click();
    //verifying email
    cy.contains("Verify Your Email").click();
    cy.contains("Verify Email").click();
    cy.contains("Email successfully verified");
    //verifying phone
    cy.contains("Verify Your Phone").click();
    cy.contains("Verify Phone").click();
    cy.contains("Phone successfully verified");
    //ordering the shopping cart items
    cy.get(".fa-shopping-cart").click();
    cy.contains("Proceed Order").click();
    cy.get("#card-element").type("4242424242424242");
    cy.contains("Pay").click();
    cy.contains("Payment succeeded");
    //sign out
    cy.contains("Sign Out").click();
  });
});
describe("The seller editing orders", () => {
  it("The seller sign in and search for some orders and edit them and then sign out", () => {
    //sign in
    cy.visit("http://localhost:3000/sign_in");
    cy.contains("Email").type("seller@email.com");
    cy.contains("Password").type("qwAS12!@");
    cy.get('button:contains("Sign In")').click();
    //search for the needed orders
    cy.contains("Orders").click();
    cy.contains("Search").type("sunglasses test item");
    cy.get(".fa-search").click();
    //edit the orders
    cy.contains("Change Shipment ID").type("1234");
    cy.contains("Change Status").type("Delivered");
    cy.contains("Update").click();
    cy.contains("Orders successfully updated");
    //sign out
    cy.contains("Sign Out").click();
  });
});
