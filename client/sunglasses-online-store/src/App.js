import "./App.css";
import UserItems from "./components/user-items/UserItems";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app" data-testid="App-div">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<UserItems requestQuery={{}} loggedIn={true} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
