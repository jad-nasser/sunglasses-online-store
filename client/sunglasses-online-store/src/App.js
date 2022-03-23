import "./App.css";
import EditOrderDestination from "./components/edit-order-destination/EditOrderDestination";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditOrderDestination />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
