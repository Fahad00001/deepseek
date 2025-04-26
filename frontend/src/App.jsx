import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthProvider";

const App = () => {
  const [authuser] = useAuth();
  console.log(authuser);

  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={authuser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={authuser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authuser ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
