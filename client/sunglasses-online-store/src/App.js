import "./App.css";
import DeactivateAccount from "./components/deactivate-account/DeactivateAccount";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DeactivateAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
