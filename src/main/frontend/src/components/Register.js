import React from "react";
import { Container, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createUserAPI, getToken } from "apis/userAPI";
import { useNavigate } from "react-router-dom";

function Register() {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState({});
    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            name: e.target.name.value,
            phoneNo: e.target.phoneNo.value,
        };

        createUserAPI(data)
            .then((response) => {
                if (response.status === 201) {
                    setAlert({
                        variant: "success",
                        message: "Account create successfully",
                    });
                }
                setLoading(false);
            })
            .catch((err) => {
                setAlert({
                    variant: "danger",
                    message: `Account with email ${data.email} already exist`,
                });
                setLoading(false);
            });
    };

    React.useEffect(() => {
        if (getToken()) navigate("/");
    }, [navigate]);

    return (
        <Container
            className="mt-5"
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
                style={{ width: "30%", display: !loading ? "block" : "none" }}
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
                <div style={{ display: "flex" }}>
                    <Form.Group className="mb-3 me-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            name="phoneNo"
                            required
                        />
                    </Form.Group>
                </div>
                <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                >
                    Register
                </Button>
                <p>
                    Already have account? <Link to="/login">Login</Link>
                </p>
            </Form>
        </Container>
    );
}

export default Register;
