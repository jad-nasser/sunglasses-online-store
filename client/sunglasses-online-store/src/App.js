import "./App.css";
import Cart from "./components/cart/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  let lsItems = [];
  lsItems[0] = {
    id: "6129f3f657b6a80a90078fb6",
    quantity: 2,
  };
  lsItems[1] = {
    id: "6129f41f57b6a80a90078fba",
    quantity: 2,
  };
  lsItems[2] = {
    id: "6129f43a57b6a80a90078fc0",
    quantity: 20,
  };
  localStorage.setItem("items", JSON.stringify(lsItems));
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cart loggedIn={true} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
