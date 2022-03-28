import "./App.css";
import CartItem from "./components/cart-item/CartItem";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  let cartItem = {
    name: "Ray-Ban Rounded",
    size: "50 150-50",
    color: "Gold metal, black glasses",
    price: 230,
    ordered_quantity: 2,
    brand: "Ray-Ban",
    _id: "1234",
    images: ["blabla.jpg"],
  };
  let ls = {};
  ls[cartItem._id] = {
    id: cartItem.id,
    quantity: cartItem.quantity,
  };
  localStorage.setItem("items", JSON.stringify(ls));
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CartItem item={cartItem} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
