import "./App.css";
import Items from "./components/items/Items";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Items requestQuery={{}} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
