# **Sunglasses Online Store**

<br>
<br>

## **Overview**

<br>

This is my first personal project website, and it takes the most time among the other personal projects to be done because I've learned the foundations of the full-stack web development while doing this project.

This project provides online sunglasses shopping. The seller can add and edit sunglasses, and the users can order sunglasses, and the seller can manage orders.

<br>
<br>

## **Technologies Used**

<br>

### **Server Side:**

- **Node js**
- **Express js**
- **MongoDB**
- **Mongoose**
- **body-parser**
- **cookie-parser**
- **cors**
- **dotenv**: for storing some enviroment variables.
- **Json Web Token**: tokens for user login stored in httpOnly cookies in user's browser.
- **Multer**: used to upload the images of sunglasses items and store them in the server.
- **Stripe**: used to get payments of orders and to create payment intents for orders.
- **Mocha**: test framework.
- **chai**: for tests assertions.
- **sinon**: used for mocking while unit testing.
- **proxyquire**: used for mocking libraries while unit testing.
- **supertest**: used for integration testing.

### **Client Side:**

- **React**
- **Bootstrap**
- **Axios**: for sending requests to the server.
- **Stripe**: for order payments.
- **dotenv**
- **form-data**: for uploading files from the client side.
- **React Router**: for managing routing through pages in the react app.
- **jest**: test framework.
- **React Testing Library**: used for unit testing.
- **Mock Service Worker**: used to mock server responses in unit testing.
- **Cypress**: used for e2e testing.
- **cypress-file-upload**: used to upload sunglasses item images for cypress e2e testing.

<br>
<br>

## **Detailed Explanation**

<br>

This project uses MVC architecture (**M**odel-**V**iew-**C**ontroller) with all MVC parts having validations for more security and it is built using **MERN** stack web development (**M**ongoDB-**E**xpressJS-**R**eactJS-**N**odeJS). The server side uses **REST API** strategy built with NodeJs, and ExpressJs framework, and MongDB database. The client is built with ReactJS framework.

The project consists of three main parts:

- **Users**
- **Items**
- **Orders**

### **Users**

This project consists of three user types:

- **The seller**
- **Non signed in user**
- **Signed in user**

All user types interactions with the system is via browser even the seller. Each user type has a specific pages for them. If a user go to a page that belongs to different user type then the user will be automatically redirected to other page.

The website will treat the user by default as a **Non signed in** user type until the user sign in as a **seller** or **signed in user**, then the server will generate Json Web Token and store it in a httpOnly cookie in user's or seller's browser. The token type of the seller is different than the user's one.

##### **The Seller**

There is only one seller for this project. The seller account is initially existed in the system and the seller can't create or deactivate his/her account.

The seller can:

- Sign in
- Sign out
- Add sunglasses items
- Edit sunglasses items
- Edit orders
- Search and advanced search for items and orders

##### **Non Signed In User**

Non signed in users can:

- Sign in
- Sign up
- Search sunglasses
- View sunglasses
- Add sunglasses to the shopping cart

##### **Signed In User**

Signed in users can:

- Sign out
- Search sunglasses
- View sunglasses
- Add sunglasses to the shopping cart
- Make orders
- View and track his/her orders
- Edit account
- Deactivate account

### **Items**

The seller is the only user that can create sunglasses items, but the items can't be deleted, instead it can be modified.

Sunglasses items with the same name but with different colors or sizes are treated in the system as different items, so for the seller they will appear as different items, but for the users the items with the same name will be merged as one item so they will appear as one item, and also the items that have zero quantities will not appear to the users but it will appear for the seller.

### **Orders**

- The signed in user is the only user that can create orders, but the seller can edit orders by changings its status or shipment id.
- The signed in user can create orders by proceeding the shopping cart items that are stored in the local storage of the user's browser.
- The website uses Stripe API for payments
- When the user click the pay button to make orders the orders are created in the database with a payment intent and with status "Awaiting payment" and then after the payment succeeds Stripe will tell the server and then the orders status will change to "Awaiting Shipment"
- Orders with status "Awaiting Payment" will not appear to the seller and the seller can't modify them and also these orders will not appear in the user's my orders list
- When the payment intent of some orders with status "Awaiting Payment "is canceled Stripe will tell the server and then these orders will be deleted from the server.

<br>
<br>

## **Project Main Files Structure**

<br>

**Note**: Most client side components represented in this documentation by the parent folder that includes them not by their .js file name.

- **models**: contains database models.
  - **item.js**: database model for sunglasses items.
  - **order.js**: database model for sunglasses orders.
  - **user.js**: database model for users.
  - **imageLinksCount.js**: this database model is for counting the number of items linked to an image because items images are stored in the server but not in the database, the only things that it is stored in the database that is related to the images is the image address, so many items can be linked to one image and the server needs to know how many items linked to an image because if an item needs to change to another image then the **imageLinksCount** to the old image will be decremented and if it reaches zero then the server knows that this image should be deleted.
- **routes**: contains routers that are responsible for the CRUD operations in the database models.
  - **item_router.js**
  - **order_router.js**
  - **user_router.js**
- **controllers**: contains controllers for item, user, and order routers.
  - **item_controller.js**: controller for item router.
  - **order_controller.js**: controller for order router.
  - **user_controller.js**: controller for user router.
- **database_controllers**: these database controllers are used by the controllers above and they are used to communicate with the database models.
  - **item_database_controller.js**: controller for item database model.
  - **order_database_controller.js**: controller for order database model.
  - **user_database_controller.js**: controller for user database model.
  - **imageLinkCount_database_controller.js**: controller for imageLinkCount database model.
- **test**: contains unit and integration tests for the server side code and some test images.
- **app.js**: its the main router that the server run and it includes all the three routers mentioned above.
- **db_connections.js**: used by the server to connect to a database.
- **server.js**: the server file itself.
- **client**: contains the client side code.
  - **cypress**: contains e2e tests.
    - **integration**
      - **e2e-testing.test.js**
  - **public**
    - **index.html**: include links to font awesome.
  - **src**
    - **App.css**: includes some css styles used in the entire app.
    - **index.js**: the main client side component.
    - **App.js**: the second main client side component included in index.js and this component includes all the routes of the client side app.
    - **data.js**: includes some data used in the client side app.
    - **scss**
      - **custome.scss**: contains some custome edits for bootstrap.
      - **custome.css**: is the result of the compiled custome.scss it includes the whole bootstrap with the new modifications and this file is used to include bootsrap instead of the original one.
    - **components**: includes all the components the the client side main app will use each component is in a folder and many components comes with .test.js files that are unit tests to this component.
      - **account-settings**: a component that include a tab that navigate the user to a setting the user needs.
      - **account-info**: a component that shows user's account info and can be accessed by account-settings component.
      - **edit-email**: allows the user to edit his/her email and can be accessed by account-settings component.
      - **edit-name**: allows the user to edit his/her name and can be accessed by account-settings component.
      - **edit-password**: allows the user to edit his/her password and can be accessed by account-settings component.
      - **edit-phone**: allows the user to edit his/her phone and can be accessed by account-settings component.
      - **edit-order-destination**: allows the user to edit his/her order destination address and can be accessed by account-settings component.
      - **verify-email**: contains verifyEmailForTestingOnly.js and its a component for testing only because if you need to verify an email you need a specific API.
      - **verify-phone**: contains verifyPhoneForTestingOnly.js and its a component for testing only because if you need to verify a phone you need a specific API.
      - **deactivate-account**: allows the user to deactivate his/her account and can be accessed by account-settings component.
      - **my-orders**: allows the user to see and track his/her orders.
      - **customer-order**: represent one ordered order by a customer and this component is used in my-orders component.
      - **cart**: represents shopping cart allows the user to remove items from the cart and to proceed the orders.
      - **cart-item**: represents one shopping cart item used in cart component.
      - **card**: responsible for proceeding orders and payment used in cart component.
      - **user-items**: the component that used in the home page to represent items to the customers.
      - **user-item**: represents one item used in user-items component.
      - **view-item**: this component rendered when a user clicks an user-item component, allows the user to view the item and select its color, size, quantity and add the item to the shopping cart.
      - **sign-in**: allows the user or the seller to sign in to the system.
      - **sign-up**: allows the user to create an account.
      - **footer**: the footer component.
      - **default-navbar**: a navbar that it is for the non signed in users.
      - **customer-navbar**: a navbar that it is for the signed in users.
      - **seller-navbar**: a navbar that it is for the seller.
      - **add-item**: allows the seller to create new sunglasses item.
      - **items**: sunglasses items page for the seller and also it allows the seller to edit items.
      - **item**: represents an item that it is used in items component.
      - **items-updator**: allows the seller to update sunglasses items, used in items component.
      - **items-advanced-search**: advanced search for sunglasses items for the seller.
      - **orders**: orders page for the seller and also it allows the seller to edit orders.
      - **order**: represents an order that it is used in orders component.
      - **order-updator**: allows the seller to update orders, used in orders component.
      - **orders-advanced-search**: advanced search for orders for the seller.
      - **route-components**: includes components that have `<Outlet/>` of react router and a components that designed to collect url search params.
        - **AccountSettingsRoute.js**: includes account-settings component tab and an outlet for the settings.
        - **Default.js**: includes default-navbar component and an outlet for non signed in users pages.
        - **User.js**: includes customer-navbar component and an outlet for signed in users pages.
        - **Seller.js**: includes seller-navbar component and an outlet for seller pages.
        - **RouteComponent.js**: responsible for collect the url search params and also responsible for navigating the user to other page if the user type is different than the page type.

<br>
<br>

## **How To Use The Website**

<br>

### **Sign In**

In order the seller or the user to sign in they need to:

1. Click the "Sign In" button in the navbar, this will navigate to the sign in page.
2. Insert email and password in the inputs.
3. Click the "Sign In" button below the inputs and then if the user is the seller the user will be navigated to the sellers items page, and if the user is a customer the user will be navigated to the user's home page.
4. The seller or user can sign out by clicking the "Sign Out" button in the navbar

### **Seller Guide**

##### **Items**

- The first page appeared to the seller after successful sign in is the sunglasses items seller page and this page initially contains all the sunglasses items in the server
- The items page allows the seller to view the items with its details and also allows the seller to edit items
- To View images of an item in full screen click the small images of the item. (the big image is not clickable)
- To update sunglasses items there is a box under the "Update Items" text in the top of the items page, this box contains inputs that represents the fields that the seller can update, the seller can fill some inputs and clicks the "Update" button below.
- In this update box there is a "Update" button and this button is disabled until the seller fill at least one input.
- It is not required by the seller to fill all the inputs in the update items box to update items, the seller can choose the fields that he/she needs to update and left the others blank so the system will only update the fields that the seller needs to change and the other fields that their inputs are empty will not changed
- After the seller fill the needed inputs in the update items box and clicks the update button, all the items that appears in the items page will be updated with the inputs the seller fills, and the seller needs to reload the page to see the effects.
- The seller should be carefull before clicking the "Update" button in the update items box beacuse the seller may need to update specific items and **clicking the "Update" button without specifying which items needs to be updated will update all the items in the server**, a thing that the seller may not needs to happen.
- In order the seller can specify which items needs to be updated, the seller needs to search to these items.
- There are two ways the seller can search for items:
  - Through the search input in the navbar the seller can fill the input and click the button that contains the search icon in the right of the input and then the page will be reloaded with only the needed items.
  - Through the items advanced search page the seller can go to this page by clicking the button that contains the configuration icon in the navbar, then the seller can fill the inputs he/she needed and then search. Again the seller is not requred to fill all the inputs in the items advanced search page.
- In the items advanced search the seller can search an item by its:
  - name
  - brand
  - color
  - size
  - price
  - quantity
  - number of times ordered
- In the items advanced search page the seller can sort the items by:
  - alphabetical order
  - most ordered
  - highest price
  - lowest price.
- In items advanced search page its not necessary for the seller to write the full field of name, brand, color, and size because the seller can write a substring and the system will find the items, same for the search input in the navbar for example if the seller wants to find an items that has name "sunglasses test item" the seller can write only "test" in the search input in the navbar and the system will find the item.
- For the seller to add new item, in the items page there is a button called "Add New Item" under the update items box, when the seller clicks it, the seller will be navigated to add item page, then the seller should fill all the inputs an click the "Add item" button below.
- Just Note that in the add item page, the file imput can only accept images of format jpg, jpeg, or png, and also this file can accept multiple images.

##### **Orders**

- The seller can go to orders page by pressing the "Orders" radio button in the navbar and if the seller wants to go back to the items page "Items" radio button in the navbar should be clicked
- The orders page is responsible for appearing the orders to the seller and also it contains a box under the "Update Orders" text in the top of the page the seller can update the orders using this box
- The "Update Orders" box works the same as the "Update Items" box in the items page so the seller needs to specify the orders needed to be updated before clicking the update button.
- Same as items page, the seller can specify which orders needs to be updated by searching for them.
- Same as items page, the seller have to methods to search for orders:
  - Through the search input in the navbar
  - Through the orders advanced search page, the seller can go to this page same as the items advanced search by clicking the button that have configuration icon in the navbar
- Orders advanced search page works as same as the items advanced search
- Orders advanced search page allows the seller to search orders by its:
  - sunglasses name
  - sunglasses brand
  - sunglasses size
  - sunglasses color
  - order shipment id
  - order status
  - order destination country
  - order date
- Orders advanced search page allows the seller to sort the orders by:
  - alphabetical order
  - order lowest price
  - order highest price
  - newest order
- In orders advanced search page its not necessary for the seller to write the full field of item name, item brand, item color, item size, and order status because the seller can write a substring and the system will find the orders, same for the search input in the navbar.

### **User Guide**

##### **Sign Up**

An email can't be linked to more than one account in the system.

In order the users can sign up they need to:

1. Go to sign in page
2. Click the "Sign Up" button in the bottom of the page, this will navigate the user to the sign up page
3. Then the user **should** fill all the inputs and sign up
4. If sign up not succeeded then maybe there are some inputs missing or the email is not valid or the password not valid or confirm password is the same as the password, and a red text will appear under the inputs telling the user what to do.
5. After the sign up is completed the user needs to sign in in order to access his/her account

##### **For Signed In & Non Signed In Users**

- The first page that appears to the user is the home page, this page allows the user to search sunglasses items.
- The user can use the search input in the navbar to search for a specific items in the home page.
- The user is not requird to enter the sunglasses item full name in the search input, because the user can write a substring of the name of the items and the system will finds the items.
- The user can use the select in the navbar to select which sunglasses brand needs to search in the home page.
- The user can sort the sunglasses items in the home page by clicking the button that contains the configuration icon, and after clicking that button the user can sort the items by:
  - Alphabetical order
  - Lowest price
  - Highest price
  - Most ordered
- The user can select a sunglasses item in the home page by clicking the item, this will navigate the user to the view item page for this item.
- In the view item page the user can see all the pictures of the item and can select the item's color, size, and quantity, and add the item to the shopping cart by clicking the "Add to cart" button.
- All the fields in the view item page are required and the quantity field should contain a number that it is greater than zero, before the user can add an item to the shopping cart.
- The user can go to the shopping cart by clicking the button that contains the shopping cart icon in the navbar.
- In the shopping cart the user can remove an item by clicking the "x" button at the top right of the item.

##### **For Signed In Users**

- For the user to make an order, the user should go to the shopping cart page and clicks the "Proceed Order" button below, this will open a box that contains inputs about payment so the user should fill them properly and click the "Pay" button in the box.
- For the user to see and track his/her orders, the user should click the button that contains the three dots icon in the navbar, and then click "My Orders".
- For the user to go to the account settings page, the user should click the button that contains the three dots icon in the navbar, and then click "Account Settings".
- The user can select which setting he/she needs by clicking a setting from the box that it is located at the left of the screen, but for small screen size this box will not appear instead a second navbar will appear under the original navbar and this navbar contains a button that have an icon like hamburger, when the user clicks this button all the settings will appear and then the user can select which setting he/she needs by clicking them.
- The account settings available are:
  - **Account Info**: allows the user to see all the account info except the password.
  - **Change Your Name**: allows the user to change his/her first and last name on the account.
  - **Change Your Email**: allows the user to change his/her email address for this account.
  - **Verify Your Email**: allows the user to verify his/her email address.
  - **Change Your Phone**: allows the user to change his/her phone number on this account.
  - **Verify Your Phone**: allows the user to verify his/her phone number.
  - **Change Your Password**: allows the user to change his/her account password.
  - **Change Order Destination**: allows the user to change his/her location address.
  - **Deactivate Your Account**: allows the user to delete his/her account.

<br>
<br>

---
