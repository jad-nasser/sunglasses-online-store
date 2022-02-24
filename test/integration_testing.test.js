//importing modules
const app = require("../app");
const mongoose = require("../db_connection");
const request = require("supertest");
const { expect } = require("chai");
const User = require("../models/user");
const Item = require("../models/item");
const Order = require("../models/order");
const ImageLinksCount = require("../models/imageLinksCount");
const asyncs = require("async");
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

//creating some useful variables to use it multiple times
const test_user1 = {
  first_name: "Karl",
  last_name: "Mark",
  email: "karlmark@email.com",
  phone: "+5458461465554",
  password: "QWas78,.",
  zip_code: 1234,
  country: "UK",
  state_province_county: "London",
  city: "London",
  street: "First street",
  bldg_apt_address: "First building, first floor",
};
const email_password = {
  email: test_user1.email,
  password: test_user1.password,
};
const email = {
  email: test_user1.email,
};
const password = {
  password: test_user1.password,
};
let user_with_same_email = Object.assign({}, test_user1);
user_with_same_email.first_name = "Matt";
const test_user2 = {
  first_name: "Terry",
  last_name: "Mark",
  email: "terrymark@email.com",
  phone: "+5458467465554",
  password: "QWas78,.",
  zip_code: 1234,
  country: "UK",
  state_province_county: "London",
  city: "London",
  street: "First street",
  bldg_apt_address: "First building, first floor",
  user_type: "seller",
};
const email_password2 = {
  email: test_user2.email,
  password: test_user2.password,
};
const test_item1 = {
  name: "Rounded",
  brand: "Ray-Ban",
  price: 230,
  size: "50 50-150",
  color: "Blue glasses, black metal",
  quantity: 5,
  images: ["qwe.jpg", "zxc.jpg"],
};
const test_item2 = {
  name: "Rounded 2",
  brand: "Ray-Ban",
  price: 230,
  size: "50 50-150",
  color: "Blue glasses, black metal",
  quantity: 5,
  images: ["asd.jpg", "poi.jpg"],
};
const test_item3 = {
  name: "Rounded",
  brand: "Brand1",
  price: 230,
  size: "50 50-150",
  color: "Blue glasses, black metal",
  quantity: 5,
  images: ["qwe.jpg", "zxc.jpg"],
};
const test_item4 = {
  name: "Rounded 2",
  brand: "Brand2",
  price: 230,
  size: "50 50-150",
  color: "Blue glasses, black metal",
  quantity: 5,
  images: ["asd.jpg", "poi.jpg"],
};
const test_item5 = {
  name: "Rounded 2",
  brand: "Brand1",
  price: 230,
  size: "50 50-150",
  color: "Blue glasses, black metal",
  quantity: 5,
  images: ["asd.jpg", "poi.jpg"],
};
const verified_test_user1 = {
  first_name: "Karl",
  last_name: "Mark",
  email: "karlmark@email.com",
  phone: "+5458461465554",
  password: "QWas78,.",
  zip_code: 1234,
  country: "UK",
  state_province_county: "London",
  city: "London",
  street: "First street",
  bldg_apt_address: "First building, first floor",
  is_phone_verified: true,
  is_email_verified: true,
};
const test_order1 = {
  item_id: "12",
  user_id: "12",
  quantity: 1,
  item_name: test_item1.name,
  item_brand: test_item1.brand,
  item_size: test_item1.size,
  item_color: test_item1.color,
  item_price: test_item1.price,
  payment_intent_id: "1",
};
const test_order2 = {
  item_id: "34",
  user_id: "1234",
  quantity: 2,
  item_name: test_item2.name,
  item_brand: test_item2.brand,
  item_size: test_item2.size,
  item_color: test_item2.color,
  item_price: test_item2.price,
  payment_intent_id: "2",
};
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

before(function () {
  //connecting to the testing database
  mongoose.connect("sunglasses-online-store-test");
});
//------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

after(function () {
  //disconnect the test database
  mongoose.disconnect();
});
//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

afterEach(async function () {
  //delete all database data
  await User.deleteMany({});
  await Item.deleteMany({});
  await Order.deleteMany({});
  await ImageLinksCount.deleteMany({});
});
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

//Testing user router
describe("Testing user router", function () {
  //Testing /user/create_user by sending a complete request and it should return a 200 response with
  //message "User added successfully"
  it('Testing /user/create_user by sending a complete request and it should return a 200 response with message "User added successfully"', function (done) {
    request(app)
      .post("/user/create_user")
      .send(test_user1)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).to.be.equal("User added successfully");
        return done();
      });
  });
  //------------------------------------------------------------------------------------------------------

  //Testing /user/user_login by sending a complete request of an exist user and it should return a
  //200 responce with a token
  it("Testing /user/user_login by sending a complete login request of an exist user and it should return a 200 responce with a token", function (done) {
    //adding a user to the test database before making a login
    let user = new User(test_user1);
    user.save();
    //sending the testing request
    request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.text = JSON.parse(res.text);
        expect(res.text.token).to.be.exist;
        done();
      });
  });
  //--------------------------------------------------------------------------------------------------------------------------------

  //Testing /user/delete_user by creating a user and then deletes it, it should return a 200 response with
  //a success message
  it("Testing /user/delete_user by creating a user and then deletes it, it should return a 200 response with a success message", function (done) {
    //create variable for token
    let token = null;
    //creating the user
    let user = new User(test_user1);
    user.save();
    //sending requests
    asyncs.series(
      [
        //making login request to get the token
        function (cb) {
          request(app)
            .post("/user/user_login")
            .send(email_password)
            .expect(function (res) {
              res.text = JSON.parse(res.text);
              token = res.text.token;
            })
            .expect(200, cb);
        },
        //sending the delete request and this request contains the token
        function (cb) {
          request(app)
            .delete("/user/delete_user")
            .set("Cookie", ["token=" + token])
            .expect(function (res) {
              expect(res.text).to.be.contain("successfully deleted");
            })
            .expect(200, cb);
        },
      ],
      done
    );
  });
  //-----------------------------------------------------------------------------------------

  //Testing /user/update_user by creating a user and then updates it, it should return a 200 response with
  //a success message
  it("Testing /user/update_user by creating a user and then updated it, it should return a 200 response with a success message", function (done) {
    //create variable for token
    let token = null;
    //creating the user
    let user = new User(test_user1);
    user.save();
    //sending requests
    asyncs.series(
      [
        //making login request to get the token
        function (cb) {
          request(app)
            .post("/user/user_login")
            .send(email_password)
            .expect(function (res) {
              res.text = JSON.parse(res.text);
              token = res.text.token;
            })
            .expect(200, cb);
        },
        //sending the update request and this request contains the token
        function (cb) {
          request(app)
            .patch("/user/update_user")
            .set("Cookie", ["token=" + token])
            .send({ first_name: "Matt" })
            .expect(function (res) {
              expect(res.text).to.be.contain("User successfully updated.");
            })
            .expect(200, cb);
        },
      ],
      done
    );
  });
  //-----------------------------------------------------------------------------------------

  it("Testing /user/get_user it should return a 200 response with the signed in user info", async function () {
    //creating final response variable
    let final_res = null;
    //create variable for token
    let token = null;
    //creating the user
    let user = new User(test_user1);
    await user.save();
    //sending login request
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending get_user request
    await request(app)
      .get("/user/get_user")
      .set("Cookie", ["token=" + token])
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_res = res;
      });
    //assertions
    expect(final_res.statusCode).to.be.equal(200);
    expect(final_res.text.user_info).to.be.exist;
  });
  //-------------------------------------------------------------------------------------------

  it("Testing /user/check_email it should return a 200 with a variable check_email = true", async function () {
    //creating final response variable
    let final_res = null;
    //creating the user
    let user = new User(test_user1);
    await user.save();
    //sending check_email request
    await request(app)
      .get("/user/check_email")
      .send(email)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_res = res;
      });
    //assertions
    expect(final_res.statusCode).to.be.equal(200);
    expect(final_res.text.check_email).to.be.true;
  });
  //--------------------------------------------------------------------------------------------

  it("Testing /user/check_password it should return a 200 response with a variable check_password = true", async function () {
    //creating final response variable
    let final_res = null;
    //creating token variable
    let token = null;
    //creating the user
    let user = new User(test_user1);
    await user.save();
    //sending login request
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending check_password request
    await request(app)
      .get("/user/check_password")
      .set("Cookie", ["token=" + token])
      .send(password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_res = res;
      });
    //assertions
    expect(final_res.statusCode).to.be.equal(200);
    expect(final_res.text.check_password).to.be.true;
  });
  //--------------------------------------------------------------------------------------------------------
});
//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

//Testing item router
describe("Testing item router", function () {
  //Testing /item/create_item by creating a seller and then create an item, it should
  //return a 200 response with a success message
  it("Testing /item/create_item by creating a seller and then create an item, it should return a 200 response with a success message", function (done) {
    //create variable for token
    let token = null;
    //creating the seller
    let user = new User(test_user2);
    user.save();
    //sending requests
    asyncs.series(
      [
        //making login request to get the token
        function (cb) {
          request(app)
            .post("/user/user_login")
            .send(email_password2)
            .expect(function (res) {
              res.text = JSON.parse(res.text);
              token = res.text.token;
            })
            .expect(200, cb);
        },
        //sending the create item request and this request contains the token
        function (cb) {
          request(app)
            .post("/item/create_item")
            .set("Cookie", ["token=" + token])
            .field("name", test_item1.name)
            .field("brand", test_item1.brand)
            .field("size", test_item1.size)
            .field("color", test_item1.color)
            .field("price", test_item1.price)
            .field("quantity", test_item1.quantity)
            .attach(
              "ItemImage",
              "./test/test_images/pexels-expect-best-1035733.jpg"
            )
            .expect(function (res) {
              expect(res.text).to.be.contain("successfully");
            })
            .expect(200, cb);
        },
      ],
      done
    );
  });
  //-----------------------------------------------------------------------------------------

  //Testing /item/get_item by creating a seller and then create an item and then getting the item, it should
  //return a 200 response with the found item
  it("Testing /item/get_items, it should return a 200 response with the found item", function (done) {
    //create variable for token
    let token = null;
    //creating the seller
    let user = new User(test_user2);
    user.save();
    //sending requests
    asyncs.series(
      [
        //making login request to get the token
        function (cb) {
          request(app)
            .post("/user/user_login")
            .send(email_password2)
            .expect(function (res) {
              res.text = JSON.parse(res.text);
              token = res.text.token;
            })
            .expect(200, cb);
        },
        //sending the create item request and this request contains the token
        function (cb) {
          request(app)
            .post("/item/create_item")
            .set("Cookie", ["token=" + token])
            .field("name", test_item1.name)
            .field("brand", test_item1.brand)
            .field("size", test_item1.size)
            .field("color", test_item1.color)
            .field("price", test_item1.price)
            .field("quantity", test_item1.quantity)
            .attach(
              "ItemImage",
              "./test/test_images/pexels-expect-best-1035733.jpg"
            )
            .expect(200, cb);
        },
        //sending another create item request to create another item
        function (cb) {
          request(app)
            .post("/item/create_item")
            .set("Cookie", ["token=" + token])
            .field("name", test_item1.name + " 2")
            .field("brand", test_item1.brand)
            .field("size", test_item1.size)
            .field("color", test_item1.color)
            .field("price", test_item1.price)
            .field("quantity", test_item1.quantity)
            .attach(
              "ItemImage",
              "./test/test_images/pexels-expect-best-1035733.jpg"
            )
            .expect(200, cb);
        },
        //sending the get items request
        function (cb) {
          request(app)
            .get("/item/get_items")
            //we searching for the item that has name 'Rounded 2' we only need to pass 2 because it has regex
            .send({ name: "2" })
            .expect(function (res) {
              res.text = JSON.parse(res.text);
              expect(Array.isArray(res.text)).to.be.true;
              expect(res.text.length).to.be.equal(1);
              expect(res.text[0].name).to.be.equal("Rounded 2");
            })
            .expect(200, cb);
        },
      ],
      done
    );
  });
  //-----------------------------------------------------------------------------------------

  //Testing /item/update_item by creating a seller and then create item2 and then updating the items 2 times,
  //it should return a 200 response with the a success message and the image links count number of elements
  //should be as follow noe0=0, noe1=1, noe2=2, noe3=1, noe4=2
  it("Testing /item/update_items, it should return a 200 response with a success message and the image links count number of elements should be as follow noe0=0, noe1=1, noe2=2, noe3=1, noe4=2", async function () {
    //create variable for the final response
    let final_response = null;
    //create variable for token
    let token = null;
    //creating the seller
    let user = new User(test_user2);
    await user.save();
    //getting the ImageLinksCount number of elements
    let noe0 = null;
    await ImageLinksCount.countDocuments(function (err, count) {
      if (err) throw err;
      noe0 = count;
    });
    //sending a request to login to the created seller account
    await request(app)
      .post("/user/user_login")
      .send(email_password2)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending a request to create the first item
    await request(app)
      .post("/item/create_item")
      .set("Cookie", ["token=" + token])
      .field("name", test_item1.name)
      .field("brand", test_item1.brand)
      .field("size", test_item1.size)
      .field("color", test_item1.color)
      .field("price", test_item1.price)
      .field("quantity", test_item1.quantity)
      .attach("ItemImage", "./test/test_images/pexels-expect-best-1035733.jpg");
    //getting the ImageLinksCount number of elements
    let noe1 = null;
    await ImageLinksCount.countDocuments(function (err, count) {
      if (err) throw err;
      noe1 = count;
    });
    //sending a request to create the second item
    await request(app)
      .post("/item/create_item")
      .set("Cookie", ["token=" + token])
      .field("name", test_item1.name + " 2")
      .field("brand", test_item1.brand)
      .field("size", test_item1.size)
      .field("color", test_item1.color)
      .field("price", test_item1.price)
      .field("quantity", test_item1.quantity)
      .attach("ItemImage", "./test/test_images/pexels-expect-best-1035733.jpg");
    //getting the ImageLinksCount number of elements
    let noe2 = null;
    await ImageLinksCount.countDocuments(function (err, count) {
      if (err) throw err;
      noe2 = count;
    });
    //sending a request to update the two created items
    await request(app)
      .patch("/item/update_items")
      .set("Cookie", ["token=" + token])
      .attach("ItemImage", "./test/test_images/pexels-expect-best-1035733.jpg");
    //getting the ImageLinksCount number of elements
    let noe3 = null;
    await ImageLinksCount.countDocuments(function (err, count) {
      if (err) throw err;
      noe3 = count;
    });
    //sending a request to update the second created item
    await request(app)
      .patch("/item/update_items")
      .set("Cookie", ["token=" + token])
      .field("search[name]", "2")
      .attach("ItemImage", "./test/test_images/pexels-expect-best-1035733.jpg")
      .expect(function (res) {
        final_response = res;
      });
    //getting the ImageLinksCount number of elements
    let noe4 = null;
    await ImageLinksCount.countDocuments(function (err, count) {
      if (err) throw err;
      noe4 = count;
    });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(noe0).to.be.equal(0);
    expect(noe1).to.be.equal(1);
    expect(noe2).to.be.equal(2);
    expect(noe3).to.be.equal(1);
    expect(noe4).to.be.equal(2);
    expect(final_response.text).to.be.contain("success");
  });
  //-----------------------------------------------------------------------------------------

  it("Testing /item/get_all_brands it should return a 200 response with 2 brands", async function () {
    //create variable for the final response
    let final_response = null;
    //creating the items in the database
    let items = [];
    items[0] = new Item(test_item3);
    items[1] = new Item(test_item4);
    items[2] = new Item(test_item5);
    await Item.insertMany(items);
    //sending a request to get all the available brands
    await request(app)
      .get("/item/get_all_brands")
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text.brands).to.be.exist;
    expect(final_response.text.brands.length).to.be.equal(2);
    expect(final_response.text.brands[0] !== final_response.text.brands[1]).to
      .be.true;
  });
});
//----------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------

//Testing order router
describe("Testing order router", function () {
  //Testing /order/create_orders by orders to two items it should return a 200 response with a
  //client secret and it should be two orders in the database
  it("Testing /order/create_orders by orders to two items it should return a 200 response with a client secret and it should be two orders in the database", async function () {
    //creating the customer
    let user = new User(verified_test_user1);
    await user.save();
    //creating the items
    let item1 = new Item(test_item1);
    let item2 = new Item(test_item2);
    await item1.save();
    await item2.save();
    //getting the items from the database
    let found_items = await Item.find({});
    //creating final response variable
    let final_response = null;
    //creating request variables
    let items = [];
    (items[0] = {
      id: found_items[0]._id,
      quantity: 2,
    }),
      (items[1] = {
        id: found_items[1]._id,
        quantity: 2,
      });
    //creating user token variable
    let token = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the create_orders request
    await request(app)
      .post("/order/create_orders")
      .set("Cookie", ["token=" + token])
      .send({ items: items })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //getting the number of orders in the database
    let number_of_orders = null;
    await Order.countDocuments(function (err, count) {
      if (err) throw err;
      number_of_orders = count;
    });
    //assertions
    expect(number_of_orders).to.be.equal(2);
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text.client_secret).to.be.exist;
  });
  //--------------------------------------------------------------------------------

  //Testing /order/get_customer_orders it should return a 200 response with a one order
  it("Testing /order/get_customer_orders it should return a 200 response with a one order", async function () {
    //creating the customer
    let user = new User(verified_test_user1);
    await user.save();
    //getting the user from the database
    let found_user = await User.findOne({
      first_name: verified_test_user1.first_name,
    });
    //creating the items
    let item1 = new Item(test_item1);
    let item2 = new Item(test_item2);
    await item1.save();
    await item2.save();
    //getting the items from the database
    let found_items = await Item.find({});
    //creating the orders but the created user have only one order
    let orders = [];
    orders[0] = {
      item_id: found_items[0]._id,
      user_id: found_user._id,
      quantity: 1,
      item_name: found_items[0].name,
      item_brand: found_items[0].brand,
      item_size: found_items[0].size,
      item_color: found_items[0].color,
      item_price: found_items[0].price,
      payment_intent_id: "1",
    };
    orders[1] = {
      item_id: found_items[1]._id,
      user_id: "1234",
      quantity: 1,
      item_name: found_items[1].name,
      item_brand: found_items[1].brand,
      item_size: found_items[1].size,
      item_color: found_items[1].color,
      item_price: found_items[1].price,
      payment_intent_id: "2",
    };
    await Order.insertMany(orders);
    //creating final response variable
    let final_response = null;
    //creating user token variable
    let token = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the get_customer_orders request
    await request(app)
      .get("/order/get_customer_orders")
      .set("Cookie", ["token=" + token])
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //getting the number of orders in the database
    let number_of_orders = null;
    await Order.countDocuments(function (err, count) {
      if (err) throw err;
      number_of_orders = count;
    });
    //assertions
    expect(number_of_orders).to.be.equal(2);
    expect(final_response.statusCode).to.be.equal(200);
    expect(Array.isArray(final_response.text)).to.be.true;
    expect(final_response.text.length).to.be.equal(1);
    expect(Array.isArray(final_response.text[0].item_info[0].images)).to.be
      .true;
    expect(final_response.text[0].item_info[0].images.length).to.be.equal(2);
  });
  //--------------------------------------------------------------------------------

  //Testing /order/get_orders it should return a 200 response with a one order
  it("Testing /order/get_orders it should return a 200 response with a one order that contains user_info and total_price = 460", async function () {
    //creating the seller
    let user = new User(test_user2);
    await user.save();
    //creating the customer
    let user2 = new User(test_user1);
    await user2.save();
    //creating the orders but the created user have only one order
    let orders = [];
    orders[0] = test_order1;
    orders[0].user_id = user2._id;
    orders[1] = test_order2;
    orders[1].user_id = user2._id;
    await Order.insertMany(orders);
    //creating final response variable
    let final_response = null;
    //creating user token variable
    let token = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password2)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the get_orders request
    await request(app)
      .get("/order/get_orders")
      .set("Cookie", ["token=" + token])
      .send({ item_name: "2" })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //getting the number of orders in the database
    let number_of_orders = null;
    await Order.countDocuments(function (err, count) {
      if (err) throw err;
      number_of_orders = count;
    });
    //assertions
    expect(number_of_orders).to.be.equal(2);
    expect(final_response.statusCode).to.be.equal(200);
    expect(Array.isArray(final_response.text)).to.be.true;
    expect(final_response.text.length).to.be.equal(1);
    expect(final_response.text[0].user_info).to.be.exist;
    expect(final_response.text[0].total_price).to.be.equal(460);
  });
  //--------------------------------------------------------------------------------

  //Testing /order/update_orders it should return a 200 response with a success message
  it("Testing /order/update_orders it should return a 200 response with a success message", async function () {
    //creating the seller
    let user = new User(test_user2);
    await user.save();
    //creating a order
    let order = new Order(test_order1);
    await order.save();
    //creating final response variable
    let final_response = null;
    //creating user token variable
    let token = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password2)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the update_orders request
    await request(app)
      .patch("/order/update_orders")
      .set("Cookie", ["token=" + token])
      .send({
        search: {
          item_name: "2",
        },
        update: {
          status: "Awaiting Shipment",
        },
      })
      .expect(function (res) {
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text).to.be.contain("success");
  });
  //--------------------------------------------------------------------------------

  //Testing /order/check_orders_validity by checking orders that its quantities are not available it should
  //return a 403 response with a not available message
  it("Testing /order/check_orders_validity by checking orders that its quantities are not available it should return a 403 response with a not available message", async function () {
    //creating the customer
    let user = new User(verified_test_user1);
    await user.save();
    //creating items
    let items = [];
    items[0] = test_item1;
    items[1] = test_item2;
    await Item.insertMany(items);
    //getting the items from the database
    const found_items = await Item.find({});
    //creating varibles for create_orders request
    let req_items = [];
    req_items[0] = {
      id: found_items[0]._id,
      quantity: 3,
    };
    req_items[1] = {
      id: found_items[1]._id,
      quantity: 3,
    };
    //creating final response variable
    let final_response = null;
    //creating user token variable
    let token = null;
    //creating payment_intent_id variable that will returned after create_orders request
    let payment_intent_id = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the create_orders request to create the orders and to get the payment_intent_id
    await request(app)
      .post("/order/create_orders")
      .set("Cookie", ["token=" + token])
      .send({ items: req_items })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        payment_intent_id = "pi_" + res.text.client_secret.split("_")[1];
      });
    //update the items by reducing the quantities so that the check_orders_validity will fail
    await Item.updateMany({}, { $inc: { quantity: -3 } });
    //sending the check_orders_validity request
    await request(app)
      .get("/order/check_orders_validity")
      .send({ payment_intent_id: payment_intent_id })
      .expect(function (res) {
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(403);
    expect(final_response.text).to.be.contain("not available");
  });
  //--------------------------------------------------------------------------------

  //Testing /order/check_orders_validity by checking orders that its quantities are available it should
  //return a 200 response with a validation sign
  it("Testing /order/check_orders_validity by checking orders that its quantities are available it should return a 200 response with a validation sign", async function () {
    //creating the customer
    let user = new User(verified_test_user1);
    await user.save();
    //creating items
    let items = [];
    items[0] = test_item1;
    items[1] = test_item2;
    await Item.insertMany(items);
    //getting the items from the database
    const found_items = await Item.find({});
    //creating varibles for create_orders request
    let req_items = [];
    req_items[0] = {
      id: found_items[0]._id,
      quantity: 3,
    };
    req_items[1] = {
      id: found_items[1]._id,
      quantity: 3,
    };
    //creating final response variable
    let final_response = null;
    //creating user token variable
    let token = null;
    //creating payment_intent_id variable that will returned after create_orders request
    let payment_intent_id = null;
    //sending login request to get a token
    await request(app)
      .post("/user/user_login")
      .send(email_password)
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        token = res.text.token;
      });
    //sending the create_orders request to create the orders and to get the payment_intent_id
    await request(app)
      .post("/order/create_orders")
      .set("Cookie", ["token=" + token])
      .send({ items: req_items })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        payment_intent_id = "pi_" + res.text.client_secret.split("_")[1];
      });
    //sending the check_orders_validity request
    await request(app)
      .get("/order/check_orders_validity")
      .send({ payment_intent_id: payment_intent_id })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text.are_orders_valid).to.be.true;
  });
  //--------------------------------------------------------------------------------

  //Testing /order/webhook by sending "paymet_intent.succeeded" event it should return a 200 response with
  //a received sign
  it("Testing /order/webhook by sending 'paymet_intent.succeeded' event it should return a 200 response with a received sign", async function () {
    //creating items
    let items = [];
    items[0] = test_item1;
    items[1] = test_item2;
    await Item.insertMany(items);
    //getting the items from the database
    const found_items = await Item.find({});
    //creating the orders
    let orders = [];
    orders[0] = {
      item_id: found_items[0]._id,
      user_id: "1",
      quantity: 1,
      item_name: found_items[0].name,
      item_brand: found_items[0].brand,
      item_size: found_items[0].size,
      item_color: found_items[0].color,
      item_price: found_items[0].price,
      payment_intent_id: "1",
    };
    orders[1] = {
      item_id: found_items[1]._id,
      user_id: "1",
      quantity: 1,
      item_name: found_items[1].name,
      item_brand: found_items[1].brand,
      item_size: found_items[1].size,
      item_color: found_items[1].color,
      item_price: found_items[1].price,
      payment_intent_id: "1",
    };
    await Order.insertMany(orders);
    //creating final response variable
    let final_response = null;
    //sending the webhook request with the "payment_intent.succeeded" event
    await request(app)
      .post("/order/webhook")
      .send({
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "1",
          },
        },
      })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text.received).to.be.true;
  });
  //--------------------------------------------------------------------------------

  //Testing /order/webhook by sending "paymet_intent.canceled" event it should return a 200 response with
  //a received sign
  it("Testing /order/webhook by sending 'paymet_intent.canceled' event it should return a 200 response with a received sign", async function () {
    //creating the orders
    let orders = [];
    orders[0] = test_order1;
    let order2 = Object.assign({}, test_order1);
    order2.item_id = "123";
    orders[1] = order2;
    await Order.insertMany(orders);
    //creating final response variable
    let final_response = null;
    //sending the webhook request with the "payment_intent.canceled" event
    await request(app)
      .post("/order/webhook")
      .send({
        type: "payment_intent.canceled",
        data: {
          object: {
            id: "1",
          },
        },
      })
      .expect(function (res) {
        res.text = JSON.parse(res.text);
        final_response = res;
      });
    //assertions
    expect(final_response.statusCode).to.be.equal(200);
    expect(final_response.text.received).to.be.true;
  });
  //--------------------------------------------------------------------------------
});
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
