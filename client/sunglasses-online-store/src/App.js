import "./App.css";
import AccountInfo from "./components/account-info/AccountInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AccountInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
