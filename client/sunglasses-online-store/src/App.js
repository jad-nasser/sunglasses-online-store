import "./App.css";
import VerifyPhoneForTestingOnly from "./components/verify-phone/VerifyPhoneForTestingOnly";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerifyPhoneForTestingOnly />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
