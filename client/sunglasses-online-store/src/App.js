//import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import DefaultNavbar from "./components/default-navbar/DefaultNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultNavbar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
