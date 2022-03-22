import "./App.css";
import VerifyEmailForTestingOnly from "./components/verify-email/VerifyEmailForTestingOnly";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerifyEmailForTestingOnly />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
