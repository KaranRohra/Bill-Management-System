import { authUserAPI, getToken } from "apis/userAPI";
import React from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState({});
    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        authUserAPI(data)
            .then((response) => {
                if (response.status === 200) {
                    cookies.set("token", response.data.token);
                    navigate("/");
                }
                setLoading(false);
            })
            .catch((err) => {
                setAlert({
                    variant: "danger",
                    message: err.response.data.error,
                });
                setLoading(false);
            });
    };

    React.useEffect(() => {
        if (getToken()) navigate("/");
    }, [navigate]);

    return (
        <Container
            className="mt-5 text-light"
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Spinner
                variant="primary"
                animation="grow"
                style={{ display: loading ? "block" : "none" }}
            />
            <Form
                style={{ width: "25%", display: !loading ? "block" : "none" }}
                onSubmit={handleFormSubmit}
            >
                <h1 className="text-center text-primary">Bill Manager</h1>
                <hr />
                {alert.variant && (
                    <Alert variant={alert.variant}>{alert.message}</Alert>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                >
                    Login
                </Button>
                <p>
                    Don't have account? <Link to="/register">Register</Link>
                </p>
            </Form>
        </Container>
    );
}

export default Login;
