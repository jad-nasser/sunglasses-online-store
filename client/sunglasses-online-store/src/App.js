import "./App.css";
import ItemsAdvancedSearch from "./components/items-advanced-search/ItemsAdvancedSearch";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  /*let order = {
    _id: "1234",
    item_id: "1234",
    shipment_id: "1234",
    date_time: new Date(Date.now()),
    user_info: {
      first_name: "Test",
      last_name: "Test",
      email: "testtest@email.com",
      phone: "+4678946143614",
      country: "Andorra",
      state_province_county: "state 1",
      city: "city 1",
      street: "street 1",
      bldg_apt_address: "first bldg, first floor",
      zip_code: 7894,
    },
    item_name: "Ray-Ban Rounded",
    item_brand: "Ray-Ban",
    item_size: "50 150-50",
    item_color: "Gold",
    item_price: 230,
    quantity: 2,
    total_price: 460,
    status: "Awaiting Shipment",
  };*/
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ItemsAdvancedSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
