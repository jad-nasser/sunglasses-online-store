import "./App.css";
import SellerNavbar from "./components/seller-navbar/SellerNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SellerNavbar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
