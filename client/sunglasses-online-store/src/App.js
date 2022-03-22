import "./App.css";
import EditPhone from "./components/edit-phone/EditPhone";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditPhone />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
