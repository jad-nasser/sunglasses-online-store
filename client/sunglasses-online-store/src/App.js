import "./App.css";
import EditName from "./components/edit-name/EditName";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditName />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
