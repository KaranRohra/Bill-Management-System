import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "components/Login";
import Register from "components/Register";
import Home from "components/Home";
import Profile from "components/Profile";
import CreateBill from "components/CreateBill";
import { getUserAPI } from "apis/userAPI";
import Cookies from "universal-cookie";
import { Spinner, Container } from "react-bootstrap";

function App() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getUserAPI()
            .then((response) => {
                setLoading(false);
            })
            .catch((err) => {
                const cookies = new Cookies();
                cookies.remove("token");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            {loading ? (
                <Container
                    className="mt-5"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    <Spinner
                        variant="primary"
                        animation="grow"
                        style={{ display: loading ? "block" : "none" }}
                    />
                </Container>
            ) : (
                <Router>
                    <Routes>
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/create" element={<CreateBill />} />
                        <Route exact path="/profile" element={<Profile />} />
                    </Routes>
                </Router>
            )}
        </div>
    );
}

export default App;
