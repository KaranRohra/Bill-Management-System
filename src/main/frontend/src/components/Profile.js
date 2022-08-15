import { getToken, getUserAPI, updateUserAPI } from "apis/userAPI";
import React from "react";
import { useNavigate } from "react-router";
import Header from "components/Header";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { toast, ToastContainer } from "react-toastify";

function Profile() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState({});
    const navigate = useNavigate();
    const cookies = new Cookies();

    React.useState(() => {
        if (!getToken()) navigate("/login");

        getUserAPI()
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [navigate]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const data = {
            email: e.target.email.value,
            name: e.target.name.value,
            phoneNo: e.target.phoneNo.value,
        };
        if (password) data["password"] = password;

        updateUserAPI(data)
            .then((response) => {
                if (response.status === 200) {
                    cookies.remove("token");
                    navigate("/login");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
                setLoading(false);
            });
    };

    return (
        <div>
            <Header />
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
                    style={{
                        width: "30%",
                        display: !loading ? "block" : "none",
                    }}
                    onSubmit={handleFormSubmit}
                >
                    <h1 className="text-center text-primary">Profile</h1>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            defaultValue={data.email}
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
                                defaultValue={data.name}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                name="phoneNo"
                                defaultValue={data.phoneNo}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div
                        style={{
                            justifyContent: "space-between",
                            display: "flex",
                        }}
                    >
                        <Link
                            to="/"
                            className="btn btn-danger"
                            style={{ width: "48%" }}
                        >
                            Cancel
                        </Link>
                        <Button
                            variant="primary"
                            type="submit"
                            style={{ width: "48%" }}
                        >
                            Save
                        </Button>
                    </div>
                    <p className="mt-2">
                        Disclaimer: Any change in profile automatically you get
                        logout
                    </p>
                </Form>
            </Container>
            <ToastContainer />
        </div>
    );
}

export default Profile;
