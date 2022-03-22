import "./App.css";
import EditEmail from "./components/edit-email/EditEmail";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditEmail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
