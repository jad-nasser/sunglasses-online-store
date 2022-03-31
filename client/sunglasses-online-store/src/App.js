import "./App.css";
import Card from "./components/card/Card";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Card />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
