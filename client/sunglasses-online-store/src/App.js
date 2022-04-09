import "./App.css";
import Item from "./components/item/Item";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const item = {
    name: "Ray-Ban Rounded",
    brand: "Ray-Ban",
    size: "50 150-50",
    color: "gold",
    quantity: 5,
    times_ordered: 100,
    price: 250,
    _id: "1234",
    images: [
      "ray-ban7.jpg",
      "ray-ban7.jpg",
      "ray-ban7.jpg",
      "ray-ban7.jpg",
      "ray-ban7.jpg",
    ],
  };
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Item item={item} viewImage={() => console.log("hello")} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
