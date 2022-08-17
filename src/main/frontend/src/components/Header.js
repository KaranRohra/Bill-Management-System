import React from "react";
import { Nav, Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Header() {
    const navigate = useNavigate();
    const cookies = new Cookies();
    return (
        <Navbar bg="light" expand="lg" variant="light">
            <Container fluid>
                <Navbar.Brand onClick={() => navigate("/")}>
                    Bill Manger
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                    >
                        <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                        <Nav.Link onClick={() => navigate("/create")}>
                            Create
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/profile")}>
                            Profile
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => {
                                cookies.remove("token");
                                navigate("/login");
                            }}
                        >
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
