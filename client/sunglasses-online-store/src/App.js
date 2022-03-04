import "./App.css";
import SignIn from "./components/sign-in/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
