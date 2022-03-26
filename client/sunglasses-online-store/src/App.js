import "./App.css";
import CustomerOrder from "./components/customer-order/CustomerOrder";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  let order = {
    item_name: "Ray-Ban Rounded",
    item_size: "50 150-50",
    item_color: "Gold metal, black glasses",
    item_price: 230,
    quantity: 2,
    date_time: new Date(Date.now()),
    item_brand: "Ray-Ban",
    status: "Delivered",
    item_id: "1234",
    item_info: {
      images: ["blabla.jpg"],
    },
  };
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerOrder order={order} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
