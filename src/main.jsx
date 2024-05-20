import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Success from "./components/Success.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename="/verification-mock/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
