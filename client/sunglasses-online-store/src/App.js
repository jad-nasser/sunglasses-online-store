import "./App.css";
import EditPassword from "./components/edit-password/EditPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
