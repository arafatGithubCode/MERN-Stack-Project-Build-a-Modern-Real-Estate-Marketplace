import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//pages
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
//layouts
import Header from "./layouts/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="sign-up/" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}
