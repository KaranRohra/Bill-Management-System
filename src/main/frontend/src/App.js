import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "components/Login";
import Register from "components/Register";
import Home from "components/Home";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
