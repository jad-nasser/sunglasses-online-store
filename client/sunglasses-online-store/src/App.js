import "./App.css";
import CustomerNavbar from "./components/customer-navbar/CustomerNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerNavbar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
