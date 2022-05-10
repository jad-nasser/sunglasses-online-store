import "./App.css";
import Default from "./components/route-components/Default";
import User from "./components/route-components/User";
import Seller from "./components/route-components/Seller";
import AccountSettingsRoute from "./components/route-components/AccountSettingsRoute";
import RouteComponent from "./components/route-components/RouteComponent";
import UserItems from "./components/user-items/UserItems";
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import Cart from "./components/cart/Cart";
import ViewItem from "./components/view-item/ViewItem";
import MyOrders from "./components/my-orders/MyOrders";
import AccountInfo from "./components/account-info/AccountInfo";
import EditName from "./components/edit-name/EditName";
import EditEmail from "./components/edit-email/EditEmail";
import EditPhone from "./components/edit-phone/EditPhone";
import EditPassword from "./components/edit-password/EditPassword";
import EditOrderDestination from "./components/edit-order-destination/EditOrderDestination";
import DeactivateAccount from "./components/deactivate-account/DeactivateAccount";
import Items from "./components/items/Items";
import Orders from "./components/orders/Orders";
import ItemsAdvancedSearch from "./components/items-advanced-search/ItemsAdvancedSearch";
import OrdersAdvancedSearch from "./components/orders-advanced-search/OrdersAdvancedSearch";
import Footer from "./components/footer/Footer";
import AddItem from "./components/add-item/AddItem";
import VerifyEmailForTestingOnly from "./components/verify-email/VerifyEmailForTestingOnly";
import VerifyPhoneForTestingOnly from "./components/verify-phone/VerifyPhoneForTestingOnly";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/" element={<Default />}>
            <Route index element={<Navigate to="home" />} />
            <Route
              path="home"
              element={
                <RouteComponent pageType="default">
                  <UserItems loggedIn={false} />
                </RouteComponent>
              }
            />
            <Route
              path="view_cart"
              element={
                <RouteComponent pageType="default">
                  <Cart loggedIn={false} />
                </RouteComponent>
              }
            />
            <Route
              path="view_item"
              element={
                <RouteComponent pageType="default">
                  <ViewItem />
                </RouteComponent>
              }
            />
            <Route
              path="sign_in"
              element={
                <RouteComponent pageType="default">
                  <SignIn />
                </RouteComponent>
              }
            />
            <Route
              path="sign_up"
              element={
                <RouteComponent pageType="default">
                  <SignUp />
                </RouteComponent>
              }
            />
          </Route>
          <Route path="/user" element={<User />}>
            <Route index element={<Navigate to="home" />} />
            <Route
              path="home"
              element={
                <RouteComponent pageType="customer">
                  <UserItems loggedIn={true} />
                </RouteComponent>
              }
            />
            <Route
              path="view_cart"
              element={
                <RouteComponent pageType="customer">
                  <Cart loggedIn={true} />
                </RouteComponent>
              }
            />
            <Route
              path="view_item"
              element={
                <RouteComponent pageType="customer">
                  <ViewItem />
                </RouteComponent>
              }
            />
            <Route
              path="my_orders"
              element={
                <RouteComponent pageType="customer">
                  <MyOrders />
                </RouteComponent>
              }
            />
            <Route path="account_settings" element={<AccountSettingsRoute />}>
              <Route index element={<Navigate to="account_info" />} />
              <Route
                path="account_info"
                element={
                  <RouteComponent pageType="customer">
                    <AccountInfo />
                  </RouteComponent>
                }
              />
              <Route
                path="edit_name"
                element={
                  <RouteComponent pageType="customer">
                    <EditName />
                  </RouteComponent>
                }
              />
              <Route
                path="edit_email"
                element={
                  <RouteComponent pageType="customer">
                    <EditEmail />
                  </RouteComponent>
                }
              />
              <Route
                path="edit_phone"
                element={
                  <RouteComponent pageType="customer">
                    <EditPhone />
                  </RouteComponent>
                }
              />
              <Route
                path="edit_password"
                element={
                  <RouteComponent pageType="customer">
                    <EditPassword />
                  </RouteComponent>
                }
              />
              <Route
                path="edit_order_destination"
                element={
                  <RouteComponent pageType="customer">
                    <EditOrderDestination />
                  </RouteComponent>
                }
              />
              <Route
                path="verify_email"
                element={
                  <RouteComponent pageType="customer">
                    <VerifyEmailForTestingOnly />
                  </RouteComponent>
                }
              />
              <Route
                path="verify_phone"
                element={
                  <RouteComponent pageType="customer">
                    <VerifyPhoneForTestingOnly />
                  </RouteComponent>
                }
              />
              <Route
                path="deactivate_account"
                element={
                  <RouteComponent pageType="customer">
                    <DeactivateAccount />
                  </RouteComponent>
                }
              />
            </Route>
          </Route>
          <Route path="/seller" element={<Seller />}>
            <Route index element={<Navigate to="items" />} />
            <Route
              path="items"
              element={
                <RouteComponent pageType="seller">
                  <Items />
                </RouteComponent>
              }
            />
            <Route
              path="orders"
              element={
                <RouteComponent pageType="seller">
                  <Orders />
                </RouteComponent>
              }
            />
            <Route
              path="items_advanced_search"
              element={
                <RouteComponent pageType="seller">
                  <ItemsAdvancedSearch />
                </RouteComponent>
              }
            />
            <Route
              path="orders_advanced_search"
              element={
                <RouteComponent pageType="seller">
                  <OrdersAdvancedSearch />
                </RouteComponent>
              }
            />
            <Route
              path="add_item"
              element={
                <RouteComponent pageType="seller">
                  <AddItem test={false} />
                </RouteComponent>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
