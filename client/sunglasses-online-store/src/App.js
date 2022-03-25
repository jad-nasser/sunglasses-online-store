import "./App.css";
import AccountSettings from "./components/account-settings/AccountSettings";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AccountSettings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
