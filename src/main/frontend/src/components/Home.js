import React from "react";
import { useNavigate } from "react-router";
import { getToken } from "apis/userAPI";
import Header from "components/Header";
import { toast, ToastContainer } from "react-toastify";
import { Accordion, Col, Container, Spinner, Card } from "react-bootstrap";
import { deleteBillAPI, getBillsAPI } from "apis/billAPI";
import Cookies from "universal-cookie";
import * as Icons from "react-bootstrap-icons";
import BillDetails from "components/BillDetails";
import { Link } from "react-router-dom";
import { formatDateTime } from "utils";

function Home() {
    const [bills, setBills] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!getToken()) navigate("/login");

        getBillsAPI({}) // TODO: Add filter fields
            .then((response) => {
                setBills(response.data);
                setLoading(false);
            })
            .catch((err) => {
                new Cookies().remove("token");
                navigate("/login");
            });
    }, [navigate]);

    const handleDelete = (id) => {
        setLoading(true);
        deleteBillAPI(id)
            .then((response) => {
                toast.success("Bill deleted successfully");
                setBills(bills.filter((bill) => bill.id !== id));
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Unable to delete bill");
                setLoading(false);
            });
    };

    return (
        <div>
            <ToastContainer />
            <Header />
            <Container style={{ display: "flex", justifyContent: "center" }}>
                <Spinner
                    variant="primary"
                    animation="grow"
                    className="mt-5"
                    style={{ display: loading ? "block" : "none" }}
                />
            </Container>
            <Container
                className="mt-5"
                style={{ display: loading ? "none" : "block" }}
            >
                {bills.length > 0 ? (
                    <div>
                        <Accordion defaultActiveKey="0" className="mb-1">
                            <Card>
                                <Card.Header
                                    style={{ display: "flex" }}
                                    className="text-dark"
                                >
                                    <Col xs={1}>ID</Col>
                                    <Col xs={2}>Biller Name</Col>
                                    <Col xs={2}>Biller Email</Col>
                                    <Col xs={2}>Phone Number</Col>
                                    <Col xs={1}>Amount</Col>
                                    <Col xs={1}>Bill Paid</Col>
                                    <Col xs={2}>Updated At</Col>
                                </Card.Header>
                            </Card>
                        </Accordion>
                        <Accordion defaultActiveKey="0">
                            {bills.map((bill, key) => {
                                bill["createdAt"] = formatDateTime(
                                    bill.createdAt
                                );
                                bill["updatedAt"] = formatDateTime(
                                    bill.updatedAt
                                );
                                return (
                                    <Accordion.Item eventKey={key} key={key}>
                                        <Accordion.Header
                                            style={{ display: "flex" }}
                                        >
                                            <Col xs={1}>#{key + 1}</Col>
                                            <Col xs={2}>{bill.billerName}</Col>
                                            <Col xs={2}>{bill.billerEmail}</Col>
                                            <Col xs={2}>{bill.phoneNo}</Col>
                                            <Col xs={1}>₹{bill.amount}</Col>
                                            <Col xs={1}>
                                                {bill.billPaid ? (
                                                    <Icons.CheckCircleFill className="text-success" />
                                                ) : (
                                                    <Icons.XCircleFill className="text-danger" />
                                                )}
                                            </Col>
                                            <Col xs={2}>{bill.updatedAt}</Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <BillDetails
                                                billIndex={key}
                                                handleDelete={handleDelete}
                                                bills={bills}
                                                setBills={setBills}
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion>
                    </div>
                ) : (
                    <div className="text-light text-center">
                        <h1>
                            No bills available to show.{" "}
                            <Link to="/create"> Create</Link>
                        </h1>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;
