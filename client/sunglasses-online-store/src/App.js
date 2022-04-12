import "./App.css";
import ItemUpdator from "./components/item-updator/ItemUpdator";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ItemUpdator requestQuery={{}} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
