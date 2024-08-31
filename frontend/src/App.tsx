import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
