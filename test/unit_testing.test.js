//importing modules
var chai = require("chai");
var expect = chai.expect;
const sinon = require("sinon");
const proxyquire = require("proxyquire");
//-------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//importing controllers to be tested and preparing the stub enviroment
const user_controller = require("../controllers/user_controller");
const item_controller = require("../controllers/item_controller");
const order_controller = require("../controllers/order_controller");
//---------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//creating a mock response
const response = {
  status_number: null,
  text: null,
  status: function (number) {
    this.status_number = number;
    return this;
  },
  send: function (txt) {
    this.text = txt;
    if (this.status_number == null) this.status_number = 200;
    return this;
  },
  json: function (txt) {
    this.text = txt;
    if (this.status_number == null) this.status_number = 200;
    return this;
  },
  cookie: function () {
    return this;
  },
};
//-------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------

//removing all stubs after each test
afterEach(function () {
  sinon.restore();
});
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------

//testing user controller
describe("Tesing user controller", function () {
  //testing create_user()
  describe("Testing create_user()", function () {
    //testing the create_user method by sending empty body request it should return a response with
    //'User first name not found'
    it("Should return a 404 response with text: 'User first name not found'", async function () {
      //creating response
      let res = Object.assign({}, response);
      //calling the testes method
      await user_controller.create_user({ body: {} }, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("User first name not found");
    });
    //----------------------------------------------------------------------------------

    //testing the create_user method by sending a request without any validations it should
    //return a response with 'The email is not valid' text
    it("Should return a 404 response with text: 'The email is not valid'", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          first_name: "test",
          last_name: "test",
          email: "testtest@test.com",
          phone: "+5454874541545",
          password: "QWer,.12",
          country: "UK",
          city: "London",
          street: "First street",
          state_province_county: "London",
          bldg_apt_address: "First bldg, first floor",
          zip_code: 1234,
        },
      };
      //calling the tested method
      await user_controller.create_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("The email is not valid");
    });
    //----------------------------------------------------------------------------------

    //testing the create_user method by sending a complete request it should return a response
    //with 'User added successfully' text
    it("Should return a 200 response with text: 'User added successfully'", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          first_name: "test",
          last_name: "test",
          email: "testtest@test.com",
          phone: "+5454874541545",
          password: "QWer,.12",
          country: "UK",
          city: "London",
          street: "First street",
          state_province_county: "London",
          bldg_apt_address: "First bldg, first floor",
          zip_code: 1234,
          email_validate: true,
          password_validate: true,
          phone_validate: true,
        },
      };
      //creating a stub and this stubs the user_datababase_controller method 'create_user()'
      let stub1 = sinon.stub();
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          create_user: stub1,
        },
      });
      //calling the tested method
      await controller.create_user(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal("User added successfully");
    });
    //-----------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------

  //testing user_login()
  describe("Testing user_login()", function () {
    //testing user_login() by sending an empty body request
    //it should return 404 response with "Email not found" message
    it("should return 404 response with message: 'Email not found'", async function () {
      //creatingt request and response
      let res = Object.assign({}, response);
      let req = { body: {} };
      //calling the tested method
      await user_controller.user_login(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Email not found");
    });
    //--------------------------------------------------------------------------

    //testing user_login() by sending a request that contains only the email address
    //it should return a 404 response with a message 'Password not found'
    it("Should return 404 response with message: 'Password not found'", async function () {
      //creating request and response
      let req = { body: { email: "testtest@test.com" } };
      let res = Object.assign({}, response);
      //calling the method
      await user_controller.user_login(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Password not found");
    });
    //------------------------------------------------------------------------------------

    //testing user_login() by sending a complete request but we will stub the database controller method to
    //do nothing so it should return a 404 response with message 'User not found'
    it("Should return 404 response with message 'User not found'", async function () {
      //creating request and response
      let req = {
        body: {
          email: "testtest@test.com",
          password: "12qwAS,.",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method find_user()
      let stub1 = sinon.stub();
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.user_login(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("User not found");
    });
    //---------------------------------------------------------------------------------------------------

    //testing user_login() by sending a complete request but we will stub the database controller method to
    //return a seller with an id '1234'
    //should return a 200 response with a seller token
    it("Should return a 200 response with a seller token", async function () {
      //creating request and response
      let req = {
        body: {
          email: "testtest@test.com",
          password: "12qwAS,.",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method find_user()
      let stub1 = sinon.stub().returns({
        _id: "1234",
        user_type: "seller",
      });
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.user_login(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.token).to.be.exist;
    });
    //---------------------------------------------------------------------------------------------------

    //testing user_login() by sending a complete request but we will stub the database controller method to
    //return a customer with an id '1234'
    //should return a 200 response with a customer token
    it("Should return a 200 response with a customer token", async function () {
      //creating request and response
      let req = {
        body: {
          email: "testtest@test.com",
          password: "12qwAS,.",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method find_user()
      let stub1 = sinon.stub().returns({
        _id: "1234",
        user_type: "customer",
      });
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.user_login(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.token).to.be.exist;
    });
    //---------------------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------

  //Testing authenticateCustomerToken()
  describe("Testing authenticateCustomerToken()", function () {
    //testing authenticateCustomerToken() by sending a request without a token
    //Should return 404 response with a "No token found" message
    it('Should return 404 response with a "No token found" message', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let headers = [];
      headers["authorization"] = "";
      let req = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateCustomerToken(req, res, () => {});
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("No token found");
    });
    //---------------------------------------------------------------------------------------

    //testing authenticateCustomerToken() by sending a request with a not valid token
    //Should return 403 response with a "Not valid token" message
    it('Should return 403 response with a "Not valid token" message', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let headers = [];
      //not valid token
      headers["authorization"] = "Bearer 1234";
      let req = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateCustomerToken(req, res, () => {});
      //assertions
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal("Not valid token");
    });
    //---------------------------------------------------------------------------------------

    //testing authenticateCustomerToken() by sending a request with a valid token
    //The request should contains "user" property
    it('The request should contains "user" property', async function () {
      //creating request and response for getting the customer token
      let req = {
        body: {
          email: "testtest@test.com",
          password: "12qwAS,.",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method find_user()
      let stub1 = sinon.stub().returns({
        _id: "1234",
        user_type: "customer",
      });
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the user_login() in order to get the token
      await controller.user_login(req, res);
      const token = res.text.token;
      //creating another request and response for testing the method
      let res2 = Object.assign({}, response);
      let headers = [];
      //not valid token
      headers["authorization"] = "Bearer " + token;
      let req2 = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateCustomerToken(req2, res2, () => {});
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(req2.user).to.be.exist;
    });
    //---------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------

  //Testing authenticateSellerToken()
  describe("Testing authenticateSellerToken()", function () {
    //testing authenticateSellerToken() by sending a request without a token
    //Should return 404 response with a "No token found" message
    it('Should return 404 response with a "No token found" message', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let headers = [];
      headers["authorization"] = "";
      let req = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateSellerToken(req, res, () => {});
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("No token found");
    });
    //---------------------------------------------------------------------------------------

    //testing authenticateSellerToken() by sending a request without a not valid token
    //Should return 403 response with a "Not valid token" message
    it('Should return 403 response with a "Not valid token" message', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let headers = [];
      //not valid token
      headers["authorization"] = "Bearer 1234";
      let req = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateSellerToken(req, res, () => {});
      //assertions
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal("Not valid token");
    });
    //---------------------------------------------------------------------------------------

    //testing authenticateSellerToken() by sending a request with a valid token
    //The request should contains "user" property
    it('The request should contains "user" property', async function () {
      //creating request and response for getting the seller token
      let req = {
        body: {
          email: "testtest@test.com",
          password: "12qwAS,.",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database controller method find_user()
      let stub1 = sinon.stub().returns({
        _id: "1234",
        user_type: "seller",
      });
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the user_login() in order to get the token
      await controller.user_login(req, res);
      const token = res.text.token;
      //creating another request and response for testing the method
      let res2 = Object.assign({}, response);
      let headers = [];
      //not valid token
      headers["authorization"] = "Bearer " + token;
      let req2 = {
        headers: headers,
      };
      //calling the tested method
      await user_controller.authenticateSellerToken(req2, res2, () => {});
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(req2.user).to.be.exist;
    });
    //---------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------

  //Testing delete_user()
  describe("Testing delete_user()", function () {
    //Testing delete_user() by sending a logged in user request with id "1234"
    //Should return a 200 response with message: "The user with the ID:1234 is successfully deleted."
    it("Should return a 200 response with message: 'The user with the ID:1234 is successfully deleted.'", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        user: {
          user_id: "1234",
        },
      };
      //stubbing the user_database_controller.delete_user()
      const stub1 = sinon.stub();
      const controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          delete_user: stub1,
        },
      });
      //calling the tested method
      await controller.delete_user(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal(
        "The user with the ID:1234 is successfully deleted."
      );
    });
    //-------------------------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------

  //Testing update_user()
  describe("Testing update_user()", function () {
    //Testing update_user() by sending a request that contains an email but this email is not validated yet
    //Should return a 404 response with message: 'The email is not valid'
    it("Should return a 404 response with message: 'The email is not valid'", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "blablabla",
        },
      };
      //calling the tested method
      await user_controller.update_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("The email is not valid");
    });
    //----------------------------------------------------------------------------------------------

    //Testing update_user() by sending a request that contains an phone but this phone is not validated yet
    //Should return a 404 response with message: 'The phone is not valid'
    it("Should return a 404 response with message: 'The phone is not valid'", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          phone: "blablabla",
        },
      };
      //calling the tested method
      await user_controller.update_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("The phone is not valid");
    });
    //----------------------------------------------------------------------------------------------

    //Testing update_user() by sending a request that contains an pasword but this password is not
    //validated yet
    //Should return a 404 response with message: 'The password is not valid'
    it("Should return a 404 response with message: 'The password is not valid'", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          password: "blablabla",
        },
      };
      //calling the tested method
      await user_controller.update_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("The password is not valid");
    });
    //----------------------------------------------------------------------------------------------

    //Testing update_user() by sending a request that contains an email with validation sign
    //Should return a 200 response with message: 'User successfully updated.'
    it("Should return a 200 response with message: 'User successfully updated.'", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "bla@bla.com",
          //email validation sign
          email_validate: true,
        },
        user: {
          user_id: "1234",
        },
      };
      //stubbing user_database_controller.update_user()
      const stub1 = sinon.stub();
      const controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          update_user: stub1,
        },
      });
      //calling the tested method
      await controller.update_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal("User successfully updated.");
    });
    //----------------------------------------------------------------------------------------------
  });
  //------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------

  //Testing email_validate()
  describe("Testing email_validate()", function () {
    //Testing email_validate() by sending an empty body request
    //Should req.body.email_validate=false after sending empty request
    it("Should req.body.email_validate=false after sending empty body request", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = { body: {} };
      //calling the tested method
      await user_controller.email_validate(req, res, () => {});
      //assertions
      expect(req.body.email_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing email_validate() by sending a request that contains a not valid email
    //Should req.body.email_validate=false after sending a request with not valid email
    it("Should req.body.email_validate=false after sending a not valid enail", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "blabla",
        },
      };
      //calling the tested method
      await user_controller.email_validate(req, res, () => {});
      //assertions
      expect(req.body.email_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing email_validate() by sending a request with a valid email but we will assume that the user
    //is already exist by stubbing the database method.
    //Should req.body.email_validate=false after sending a valid email and assumming the the user is
    //already exists in the database
    it("Should req.body.email_validate=false after sending a valid email and assuming the the user is already exists in the database", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "test@test.com",
        },
      };
      //stubbing user_database_controller.find_user()
      const stub1 = sinon.stub().returns(true);
      const controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.email_validate(req, res, () => {});
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(req.body.email_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing email_validate() by sending a request with a valid email but we will assume that the user
    //is not exist by stubbing the database method.
    //Should req.body.email_validate=true after sending a valid email and assumming the the user is
    //not exists in the database
    it("Should req.body.email_validate=true after sending a valid email and assuming the the user is not exists in the database", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "test@test.com",
        },
      };
      //stubbing user_database_controller.find_user()
      const stub1 = sinon.stub().returns(false);
      const controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.email_validate(req, res, () => {});
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(req.body.email_validate).to.be.true;
    });
    //----------------------------------------------------------------------------------------------
  });
  //-------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------

  //Testing password_validate()
  describe("Testing password_validate()", function () {
    //Testing passwoed_validate() by sending an empty body request
    //Should req.body.password_validate=false after sending empty request
    it("Should req.body.password_validate=false after sending empty body request", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = { body: {} };
      //calling the tested method
      await user_controller.password_validate(req, res, () => {});
      //assertions
      expect(req.body.password_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing password_validate() by sending a request that contains a not valid password
    //Should req.body.password_validate=false after sending a request with not valid password
    it("Should req.body.password_validate=false after sending a not valid password", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          password: "admin",
        },
      };
      //calling the tested method
      await user_controller.password_validate(req, res, () => {});
      //assertions
      expect(req.body.password_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing password_validate() by sending a request with a valid password
    //Should req.body.password_validate=true after sending a valid password
    it("Should req.body.password_validate=true after sending a valid password", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          password: "PKfv,.49",
        },
      };
      //calling the tested method
      await user_controller.password_validate(req, res, () => {});
      //assertions
      expect(req.body.password_validate).to.be.true;
    });
    //----------------------------------------------------------------------------------------------
  });
  //-------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------

  //Testing phone_validate()
  describe("Testing phone_validate()", function () {
    //Testing phone_validate() by sending an empty body request
    //Should req.body.phone_validate=false after sending empty request
    it("Should req.body.phone_validate=false after sending empty body request", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = { body: {} };
      //calling the tested method
      await user_controller.phone_validate(req, res, () => {});
      //assertions
      expect(req.body.phone_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing phone_validate() by sending a request that contains a not valid phone
    //Should req.body.phone_validate=false after sending a request with not valid phone
    it("Should req.body.phone_validate=false after sending a not valid phone", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          phone: "blabla",
        },
      };
      //calling the tested method
      await user_controller.phone_validate(req, res, () => {});
      //assertions
      expect(req.body.phone_validate).to.be.false;
    });
    //----------------------------------------------------------------------------------------------

    //Testing phone_validate() by sending a request with a valid phone
    //Should req.body.phone_validate=true after sending a valid phone
    it("Should req.body.phone_validate=true after sending a valid phone", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          phone: "+5 46841344132415456465465416546",
        },
      };
      //calling the tested method
      await user_controller.phone_validate(req, res, () => {});
      //assertions
      expect(req.body.phone_validate).to.be.true;
    });
    //----------------------------------------------------------------------------------------------
  });
  //-------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------

  describe("Testing /user/get_user", function () {
    it("Should return a 200 response with a user_info variable", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        user: {
          user_id: "1234",
          user_type: "customer",
        },
      };
      //stubbing database method
      let mock_user = {
        _id: "1234",
        first_name: "Test",
        last_name: "Test",
        user_type: "customer",
        password: "qwertY7,",
      };
      let find_user_stub = sinon.stub().returns(mock_user);
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: find_user_stub,
        },
      });
      //calling the tested method
      await controller.get_user(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(find_user_stub.calledOnce).to.be.true;
      expect(res.text.user_info).to.be.exist;
    });
    //-------------------------------------------------------------------------------------
  });
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------

  describe("Testing /user/check_email", function () {
    it('Should return 404 response with a message "Write an email address"', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {},
      };
      //calling the tested method
      await user_controller.check_email(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Write an email address");
    });
    //-------------------------------------------------------------------------------

    it("Should return a 200 response with false", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "testtest@test.com",
        },
      };
      //stubbing the database method
      let find_user_stub = sinon.stub().returns(null);
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: find_user_stub,
        },
      });
      //calling the tested method
      await controller.check_email(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(find_user_stub.calledOnce).to.be.true;
      expect(res.text.check_email).to.be.false;
    });
    //----------------------------------------------------------------------------------

    it("Should return a 200 response with true", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          email: "testtest@test.com",
        },
      };
      //stubbing database method
      let mock_user = {
        _id: "1234",
        first_name: "Test",
        last_name: "Test",
        user_type: "customer",
        email: "testtest@test.com",
      };
      let find_user_stub = sinon.stub().returns(mock_user);
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: find_user_stub,
        },
      });
      //calling the tested method
      await controller.check_email(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(find_user_stub.calledOnce).to.be.true;
      expect(res.text.check_email).to.be.true;
    });
    //----------------------------------------------------------------------------------
  });
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------

  describe("Testing /user/check_password", function () {
    it('Should return a 404 response with a message "Write your password"', async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {},
        user: {
          user_id: "1234",
          user_type: "customer",
        },
      };
      //calling the tested method
      await user_controller.check_password(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Write your password");
    });
    //-----------------------------------------------------------------------------

    it("Should return a 200 response with false", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          password: "qwertY7,",
        },
        user: {
          user_id: "1234",
          user_type: "customer",
        },
      };
      //stubbing the database method
      let mock_user = {
        _id: "1234",
        first_name: "Test",
        last_name: "Test",
        user_type: "customer",
        email: "testtest@test.com",
        password: "qwertY8,",
      };
      let find_user_stub = sinon.stub().returns(mock_user);
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: find_user_stub,
        },
      });
      //calling the tested method
      await controller.check_password(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(find_user_stub.calledOnce).to.be.true;
      expect(res.text.check_password).to.be.false;
    });
    //-----------------------------------------------------------------------------

    it("Should return a 200 response with true", async function () {
      //creating request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          password: "qwertY7,",
        },
        user: {
          user_id: "1234",
          user_type: "customer",
        },
      };
      //stubbing the database method
      let mock_user = {
        _id: "1234",
        first_name: "Test",
        last_name: "Test",
        user_type: "customer",
        email: "testtest@test.com",
        password: "qwertY7,",
      };
      let find_user_stub = sinon.stub().returns(mock_user);
      let controller = proxyquire("../controllers/user_controller", {
        "../database_controllers/user_database_controller": {
          find_user: find_user_stub,
        },
      });
      //calling the tested method
      await controller.check_password(req, res);
      //assertions
      expect(res.status_number).to.be.equal(200);
      expect(find_user_stub.calledOnce).to.be.true;
      expect(res.text.check_password).to.be.true;
    });
    //-----------------------------------------------------------------------------
  });
  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------
});
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//Testing item controller
describe("Testing item controller", function () {
  //Testing create_item()
  describe("Testing create_item()", function () {
    //Testing create_item() by sending an empty body request
    //Should return a 404 response with message "Item name not found"
    it('Should return a 404 response with message "Item name not found"', async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {},
      };
      //calling the tested method
      await item_controller.create_item(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Item name not found");
    });
    //--------------------------------------------------------------------------------------------

    //Testing create_item() by sending a request that contains all the item information but without any image
    //Should return a 404 response with message "At least one image is required"
    it('Should return a 404 response with message "At least one image is required"', async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          name: "Rounded",
          brand: "Ray-Ban",
          color: "Black glasses, gold metal",
          size: "50 50-150",
          price: 230,
          quantity: 10,
        },
      };
      //calling the tested method
      await item_controller.create_item(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("At least one image is required");
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_item() by sending a complete request
    //Should return a 200 response with message "Item added successfully"
    it('Should return a 200 response with message "Item added successfully"', async function () {
      //create request and response
      let files = [];
      files[0] = { path: "blabla.jpg" };
      files[1] = { path: "bla.jpg" };
      let res = Object.assign({}, response);
      let req = {
        body: {
          name: "Rounded",
          brand: "Ray-Ban",
          color: "Black glasses, gold metal",
          size: "50 50-150",
          price: 230,
          quantity: 10,
        },
        files: files,
      };
      //stubbing imageLinksCount_database_controller.create_imageLinksCount() and
      //item_database_controller.create_item()
      let stub1 = sinon.stub();
      let controller = proxyquire("../controllers/item_controller", {
        "../database_controllers/imageLinksCount_database_controller": {
          create_imageLinksCount: stub1,
        },
        "../database_controllers/item_database_controller": {
          create_item: stub1,
        },
      });
      //calling the tested method
      await controller.create_item(req, res);
      //assertions
      expect(stub1.calledThrice).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal("Item added successfully");
    });
    //-------------------------------------------------------------------------------------------
  });
  //------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------

  //Testing get_items()
  describe("Testing get_items()", function () {
    //Testing get_item() by stubbing the database method to return some items
    //Should return a 200 response with some items
    it("Should return a 200 response with some items", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = { body: {} };
      //stubbing item_database_controller.find_items()
      let items = [];
      items[0] = { name: "item0" };
      items[1] = { name: "item1" };
      let stub1 = sinon.stub().returns(items);
      let controller = proxyquire("../controllers/item_controller", {
        "../database_controllers/item_database_controller": {
          find_items: stub1,
        },
      });
      //calling the tested method
      await controller.get_items(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.length).to.be.equal(2);
    });
    //-------------------------------------------------------------------------------------------
  });
  //---------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------

  //Testing update_items()
  describe("Testing update_items()", function () {
    //Testing update_items() by using 5 stubs and stub4 should not called
    //Should return a 200 response with message "items successfully updated." and stub4 not used
    it('Should return a 200 response with message "items successfully updated." and stub4 not used', async function () {
      //create request and response
      let files = [];
      files[0] = { path: "blabla.jpg" };
      files[1] = { path: "bla.jpg" };
      let res = Object.assign({}, response);
      let req = {
        body: {
          search: { name: "Rounded" },
        },
        files: files,
      };
      //stubbing all the database methods used in the tested method and fs.unlinkSync()
      let stub1 = sinon.stub().callsFake(function () {
        let images1 = [];
        let images2 = [];
        images1[0] = "image1.jpg";
        images1[1] = "image2.jpg";
        images2[0] = "image3.jpg";
        images2[1] = "image4.jpg";
        let items = [];
        items[0] = {
          name: "item1",
          images: images1,
        };
        items[1] = {
          name: "item2",
          images: images2,
        };
        return items;
      });
      let stub2 = sinon.stub().returns({ count: 2 });
      let stub3 = sinon.stub();
      let stub4 = sinon.stub();
      let stub5 = sinon.stub();
      let controller = proxyquire("../controllers/item_controller", {
        "../database_controllers/imageLinksCount_database_controller": {
          find_imageLinksCount: stub2,
          update_imageLinksCount: stub3,
          delete_imageLinksCount: stub4,
          create_imageLinksCount: stub5,
        },
        "../database_controllers/item_database_controller": {
          find_items: stub1,
          update_items: stub5,
        },
        fs: {
          unlinkSync: stub4,
        },
      });
      //calling the tested method
      await controller.update_items(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(stub2.callCount).to.be.equal(4);
      expect(stub3.callCount).to.be.equal(4);
      expect(stub4.called).to.be.false;
      expect(stub5.callCount).to.be.equal(3);
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal("items successfully updated.");
    });
    //-------------------------------------------------------------------------------------------

    //Testing update_items() by using 5 stubs and stub3 should not called
    //Should return a 200 response with message "items successfully updated." and stub3 not used
    it('Should return a 200 response with message "items successfully updated." and stub3 not used', async function () {
      //create request and response
      let files = [];
      files[0] = { path: "blabla.jpg" };
      files[1] = { path: "bla.jpg" };
      let res = Object.assign({}, response);
      let req = {
        body: {
          search: { name: "Rounded" },
        },
        files: files,
      };
      //stubbing all the database methods used in the tested method and fs.unlinkSync()
      let stub1 = sinon.stub().callsFake(function () {
        let images1 = [];
        let images2 = [];
        images1[0] = "image1.jpg";
        images1[1] = "image2.jpg";
        images2[0] = "image3.jpg";
        images2[1] = "image4.jpg";
        let items = [];
        items[0] = {
          name: "item1",
          images: images1,
        };
        items[1] = {
          name: "item2",
          images: images2,
        };
        return items;
      });
      let stub2 = sinon.stub().returns({ count: 1 });
      let stub3 = sinon.stub();
      let stub4 = sinon.stub();
      let stub5 = sinon.stub();
      let controller = proxyquire("../controllers/item_controller", {
        "../database_controllers/imageLinksCount_database_controller": {
          find_imageLinksCount: stub2,
          update_imageLinksCount: stub3,
          delete_imageLinksCount: stub4,
          create_imageLinksCount: stub5,
        },
        "../database_controllers/item_database_controller": {
          find_items: stub1,
          update_items: stub5,
        },
        fs: {
          unlinkSync: stub4,
        },
      });
      //calling the tested method
      await controller.update_items(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(stub2.callCount).to.be.equal(4);
      expect(stub4.callCount).to.be.equal(8);
      expect(stub3.called).to.be.false;
      expect(stub5.callCount).to.be.equal(3);
      expect(res.status_number).to.be.equal(200);
      expect(res.text).to.be.equal("items successfully updated.");
    });
    //-------------------------------------------------------------------------------------------
  });
  //---------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------
});
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

//Testing order controller
describe("Testing order controller", function () {
  //Testing get_customer_orders()
  describe("Testing get_customer_orders()", function () {
    //stubbing the database methods to return some orders
    //Should return a 200 response with the orders
    it("Should return a 200 response with the orders", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        user: {
          user_id: "1234",
        },
      };
      //stubbing the database method
      let stub1 = sinon.stub().callsFake(function () {
        let orders = [];
        orders[0] = {
          _id: "1",
        };
        orders[1] = {
          _id: "2",
        };
        return orders;
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/order_database_controller": {
          find_customer_orders: stub1,
        },
      });
      //calling the tested method
      await controller.get_customer_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.text.length).to.be.equal(2);
    });
    //-------------------------------------------------------------------------------------------
  });
  //--------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------

  //Testing get_orders()
  describe("Testing get_orders()", function () {
    //stubbing the database methods to return some orders
    //Should return a 200 response with the orders
    it("Should return a 200 response with the orders", async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          shipment_id: "1234",
        },
      };
      //stubbing the database method
      let stub1 = sinon.stub().callsFake(function () {
        let orders = [];
        orders[0] = {
          _id: "1",
          shipment_id: "1234",
        };
        orders[1] = {
          _id: "2",
          shipment_id: "1234",
        };
        return orders;
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/order_database_controller": {
          find_orders: stub1,
        },
      });
      //calling the tested method
      await controller.get_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.text.length).to.be.equal(2);
    });
    //-------------------------------------------------------------------------------------------
  });
  //---------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------

  //Testing update_orders()
  describe("Testing update_orders()", function () {
    //Should return a 200 response with message "Orders successfully updated"
    it('Should return a 200 response with message "Orders successfully updated"', async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {
          search: {
            shipment_id: "123",
          },
          update: {
            shipment_id: "1234",
          },
        },
      };
      //stubbing the database method
      let stub1 = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/order_database_controller": {
          update_orders: stub1,
        },
      });
      //calling the tested method
      await controller.update_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.text).to.be.equal("Orders successfully updated");
    });
    //-------------------------------------------------------------------------------------------
  });
  //-------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------

  //Testing create_orders()
  describe("Testing create_orders()", function () {
    //Testing create_orders() by sending empty body request
    //Should return a 404 response with message "No ordered items found"
    it('Should return a 404 response with message "No ordered items found"', async function () {
      //create request and response
      let res = Object.assign({}, response);
      let req = {
        body: {},
      };
      //calling the tested method
      await order_controller.create_orders(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("No ordered items found");
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains duplicated items
    //Should return a 404 response with message "Duplicated items are not allowded"
    it('Should return a 404 response with message "Duplicated items are not allowded"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
      };
      items[1] = {
        id: "1234",
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
      };
      //calling the tested method
      await order_controller.create_orders(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Duplicated items are not allowded");
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items and assuming that the user
    //phone is not verified
    //Should return a 403 response with message "You need to verify your phone to proceed this order"
    it('Should return a 403 response with message "You need to verify your phone to proceed this order"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
      };
      items[1] = {
        id: "12345",
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that its phone is not verified
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: false,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal(
        "You need to verify your phone to proceed this order"
      );
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items and assuming that the user
    //email is not verified
    //Should return a 403 response with message "You need to verify your email to proceed this order"
    it('Should return a 403 response with message "You need to verify your email to proceed this order"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
      };
      items[1] = {
        id: "12345",
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that its email is not verified
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: true,
        is_email_verified: false,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal(
        "You need to verify your email to proceed this order"
      );
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items that contains
    //only the items id without each item quantity
    //in this test we will assume that both email and phone of the user are verified
    //Should return a 404 response with message "Bad request"
    it('Should return a 404 response with message "Bad request"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
      };
      items[1] = {
        id: "12345",
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that both phone and email are verified
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: true,
        is_email_verified: true,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Bad request");
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items
    //in this test we will assume that the items are not found in the database
    //also in this test we will assume that both email and phone of the user are verified
    //Should return a 404 response with message "Some items in your request is not found"
    it('Should return a 404 response with message "Some items in your request is not found"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
        quantity: 1,
      };
      items[1] = {
        id: "12345",
        quantity: 2,
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that both phone and email are verified
      //also stubbing another database method to not find the items
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: true,
        is_email_verified: true,
      });
      let stub2 = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
        "../database_controllers/item_database_controller": {
          find_item: stub2,
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(stub2.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal("Some items in your request is not found");
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items
    //in this test we will assume that the items are found in the database but with zero quantities
    //also in this test we will assume that both email and phone of the user are verified
    //Should return a 404 response with message "Some ordered item quantity are not available in our store"
    it('Should return a 404 response with message "Some ordered item quantity are not available in our store"', async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
        quantity: 1,
      };
      items[1] = {
        id: "12345",
        quantity: 2,
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that both phone and email are verified
      //also stubbing another database method to find the item but with zero quantity
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: true,
        is_email_verified: true,
      });
      let stub2 = sinon.stub().returns({
        _id: "1234",
        quantity: 0,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
        "../database_controllers/item_database_controller": {
          find_item: stub2,
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(stub2.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal(
        "Some ordered item quantity are not available in our store"
      );
    });
    //-------------------------------------------------------------------------------------------

    //Testing create_orders() by sending a request that contains items
    //in this test we will assume that the items are found with enought quantities
    //also in this test we will assume that both email and phone of the user are verified
    //Should return a 200 response with the client_secret
    it("Should return a 200 response with the client secret", async function () {
      //create request and response
      let items = [];
      items[0] = {
        id: "1234",
        quantity: 1,
      };
      items[1] = {
        id: "12345",
        quantity: 2,
      };
      let res = Object.assign({}, response);
      let req = {
        body: {
          items: items,
        },
        user: {
          user_id: "12",
        },
      };
      //stubbing the database method to return a user that both phone and email are verified
      //also stubbing another database method to find the item with enought quantities
      //also stubbing the stripe intent creation method
      //also stubbing create order database method
      let stub1 = sinon.stub().returns({
        _id: "12",
        is_phone_verified: true,
        is_email_verified: true,
      });
      let stub2 = sinon.stub().returns({
        _id: "1234",
        quantity: 5,
        name: "rounded",
        brand: "Ray-Ban",
        price: 230,
        color: "Black glasses, gold metal",
        size: "50 50-150",
      });
      let stub3 = sinon.stub().returns({
        id: "45",
        client_secret: "56",
      });
      let stub4 = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/user_database_controller": {
          find_user: stub1,
        },
        "../database_controllers/item_database_controller": {
          find_item: stub2,
        },
        "../database_controllers/order_database_controller": {
          create_orders: stub4,
        },
        "../stripe": {
          paymentIntents: {
            create: stub3,
          },
        },
      });
      //calling the tested method
      await controller.create_orders(req, res);
      //assertions
      expect(stub1.calledOnce).to.be.true;
      expect(stub2.calledTwice).to.be.true;
      expect(stub3.calledOnce).to.be.true;
      expect(
        stub3.calledWith({
          amount: 230 * 3 * 100,
          currency: "usd",
          metadata: { integration_check: "accept_a_payment" },
        })
      ).to.be.true;
      expect(stub4.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.client_secret).to.be.exist;
    });
    //-------------------------------------------------------------------------------------------
  });
  //---------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------

  //Testing check_orders_validity()
  describe("Testing check_orders_validity()", function () {
    //Testing check_orders_validity() by sending empty body request
    //Should return a 404 response with message "Payment intent ID not found in the request"
    it('Should return a 404 response with message "Payment intent ID not found in the request"', async function () {
      //creating request and response
      let req = { body: {} };
      let res = Object.assign({}, response);
      //calling the tested method
      await order_controller.check_orders_validity(req, res);
      //assertions
      expect(res.status_number).to.be.equal(404);
      expect(res.text).to.be.equal(
        "Payment intent ID not found in the request"
      );
    });
    //---------------------------------------------------------------------------------------------

    //Testing check_orders_validity() by sending a request with a payment_intent_id but we will assume
    //that this payment intent is not exist
    //Should return a 403 response with message "Payment intent not found"
    it('Should return a 403 response with message "Payment intent not found"', async function () {
      //creating request and response
      let req = {
        body: {
          payment_intent_id: "123",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the stripe method to make it not find any payment intent
      let payment_intent_retrieve_stub = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../stripe": {
          paymentIntents: {
            retrieve: payment_intent_retrieve_stub,
          },
        },
      });
      //calling the tested method
      await controller.check_orders_validity(req, res);
      //assertions
      expect(payment_intent_retrieve_stub.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal("Payment intent not found");
    });
    //---------------------------------------------------------------------------------------------

    //Testing check_orders_validity() by sending a request with a payment_intent_id and we will assume
    //that this payment intent exists but its canceled
    //Should return a 403 response with message "This payment intent is not valid because its either succeeded or canceled"
    it('Should return a 403 response with message "This payment intent is not valid because its either succeeded or canceled"', async function () {
      //creating request and response
      let req = {
        body: {
          payment_intent_id: "123",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the stripe method to make find a canceled payment intent
      let payment_intent_retrieve_stub = sinon.stub().returns({
        id: "123",
        client_secret: "1234",
        status: "canceled",
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../stripe": {
          paymentIntents: {
            retrieve: payment_intent_retrieve_stub,
          },
        },
      });
      //calling the tested method
      await controller.check_orders_validity(req, res);
      //assertions
      expect(payment_intent_retrieve_stub.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal(
        "This payment intent is not valid because its either succeeded or canceled"
      );
    });
    //---------------------------------------------------------------------------------------------

    //Testing check_orders_validity() by sending a request with a payment_intent_id and we will assume
    //that this payment intent exists and valid but we will also assume that the ordered quantities are
    //more than the available quantities
    //Should return a 403 response with message "Some order quantity is not available at our store"
    it('Should return a 403 response with message "Some order quantity is not available at our store"', async function () {
      //creating request and response
      let req = {
        body: {
          payment_intent_id: "123",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the stripe method to make it find available payment intent
      //also stubbing the database find_orders and find_item methods to return orders and items so that
      //the ordered quantites is more than the available items
      //also stubbing the stripe method payment intent cancel to do nothing because in this case the code
      //cancels the payment intent
      let payment_intent_retrieve_stub = sinon.stub().returns({
        id: "123",
        client_secret: "1234",
        status: "valid",
      });
      let payment_intent_cancel_stub = sinon.stub();
      let find_orders_stub = sinon.stub().callsFake(function () {
        let orders = [];
        orders[0] = {
          _id: "21",
          item_id: "31",
          quantity: 5,
        };
        orders[1] = {
          _id: "22",
          item_id: "32",
          quantity: 5,
        };
        return orders;
      });
      let find_item_stub = sinon.stub().returns({
        _id: "31",
        quantity: 1,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../stripe": {
          paymentIntents: {
            retrieve: payment_intent_retrieve_stub,
            cancel: payment_intent_cancel_stub,
          },
        },
        "../database_controllers/order_database_controller": {
          find_orders: find_orders_stub,
        },
        "../database_controllers/item_database_controller": {
          find_item: find_item_stub,
        },
      });
      //calling the tested method
      await controller.check_orders_validity(req, res);
      //assertions
      expect(payment_intent_retrieve_stub.calledOnce).to.be.true;
      expect(payment_intent_cancel_stub.calledOnce).to.be.true;
      expect(find_orders_stub.calledOnce).to.be.true;
      expect(find_item_stub.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(403);
      expect(res.text).to.be.equal(
        "Some order quantity is not available at our store"
      );
    });
    //---------------------------------------------------------------------------------------------

    //Testing check_orders_validity() by sending a request with a payment_intent_id and we will assume
    //that this payment intent exists and valid and the ordered quantities are less than
    //the available quantities
    //Should return a 200 response with orders validation sign
    it("Should return a 200 response with orders validation sign", async function () {
      //creating request and response
      let req = {
        body: {
          payment_intent_id: "123",
        },
      };
      let res = Object.assign({}, response);
      //stubbing the stripe method to make it find available payment intent and stubbing the cancel method
      //also stubbing the database find_orders and find_item methods to return orders and items so that
      //the ordered quantites is less than the available items
      let payment_intent_retrieve_stub = sinon.stub().returns({
        id: "123",
        client_secret: "1234",
        status: "valid",
      });
      let payment_intent_cancel_stub = sinon.stub();
      let find_orders_stub = sinon.stub().callsFake(function () {
        let orders = [];
        orders[0] = {
          _id: "21",
          item_id: "31",
          quantity: 1,
        };
        orders[1] = {
          _id: "22",
          item_id: "32",
          quantity: 1,
        };
        return orders;
      });
      let find_item_stub = sinon.stub().returns({
        _id: "31",
        quantity: 5,
      });
      let controller = proxyquire("../controllers/order_controller", {
        "../stripe": {
          paymentIntents: {
            retrieve: payment_intent_retrieve_stub,
            cancel: payment_intent_cancel_stub,
          },
        },
        "../database_controllers/order_database_controller": {
          find_orders: find_orders_stub,
        },
        "../database_controllers/item_database_controller": {
          find_item: find_item_stub,
        },
      });
      //calling the tested method
      await controller.check_orders_validity(req, res);
      //assertions
      expect(payment_intent_retrieve_stub.calledOnce).to.be.true;
      expect(payment_intent_cancel_stub.called).to.be.false;
      expect(find_orders_stub.calledOnce).to.be.true;
      expect(find_item_stub.calledTwice).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.are_orders_valid).to.be.true;
    });
    //---------------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------

  //Testing webhook()
  describe("Testing webhook()", function () {
    //Testing webhook() by sending a request with "payment_intent.succeeded" event
    //Should return a 200 response with event recieved sign
    it('Should return a 200 response with event recieved sign after sending "payment_intent.succeeded" event', async function () {
      //creating request and response
      let req = {
        body: {
          type: "payment_intent.succeeded",
          data: {
            object: {
              id: "123",
            },
          },
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database find_orders to find some orders and other database methods
      let find_orders_stub = sinon.stub().callsFake(function () {
        let orders = [];
        orders[0] = {
          _id: "21",
          item_id: "31",
          quantity: 1,
        };
        orders[1] = {
          _id: "22",
          item_id: "32",
          quantity: 1,
        };
        return orders;
      });
      let update_item_stub = sinon.stub();
      let update_orders_stub = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/order_database_controller": {
          find_orders: find_orders_stub,
          update_orders: update_orders_stub,
        },
        "../database_controllers/item_database_controller": {
          update_item: update_item_stub,
        },
      });
      //calling the tested method
      await controller.webhook(req, res);
      //assertions
      expect(find_orders_stub.calledOnce).to.be.true;
      expect(update_item_stub.calledTwice).to.be.true;
      expect(update_orders_stub.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.received).to.be.true;
    });
    //---------------------------------------------------------------------------------------------

    //Testing webhook() by sending a request with "payment_intent.canceled" event
    //Should return a 200 response with event recieved sign
    it('Should return a 200 response with event recieved sign after sending "payment_intent.canceled" event', async function () {
      //creating request and response
      let req = {
        body: {
          type: "payment_intent.canceled",
          data: {
            object: {
              id: "123",
            },
          },
        },
      };
      let res = Object.assign({}, response);
      //stubbing the database delete_orders method
      let delete_orders_stub = sinon.stub();
      let controller = proxyquire("../controllers/order_controller", {
        "../database_controllers/order_database_controller": {
          delete_orders: delete_orders_stub,
        },
      });
      //calling the tested method
      await controller.webhook(req, res);
      //assertions
      expect(delete_orders_stub.calledOnce).to.be.true;
      expect(res.status_number).to.be.equal(200);
      expect(res.text.received).to.be.true;
    });
    //---------------------------------------------------------------------------------------------
  });
  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------
});
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
