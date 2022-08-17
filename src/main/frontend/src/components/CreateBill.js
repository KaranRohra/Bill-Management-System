import React from "react";
import { useNavigate } from "react-router";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "components/Header";
import { getToken } from "apis/userAPI";
import { createBillAPI } from "apis/billAPI";
import { toast } from "react-toastify";

function CreateBill() {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState({});
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!getToken()) navigate("/");
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const bill = {
            billerName: e.target.billerName.value,
            billerEmail: e.target.billerEmail.value,
            phoneNo: e.target.phoneNo.value,
            amount: e.target.amount.value,
            amountPaid: e.target.amountPaid.value,
            description: e.target.description.value,
        };
        bill["isBillPaid"] = bill.amountPaid >= bill.amount;

        createBillAPI(bill)
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Bill Created Successfully");
                    navigate("/");
                }
                setLoading(false);
            })
            .catch((err) => {
                setAlert({ variant: "danger", message: "Some error occurred" });
                setLoading(false);
            });
    };

    return (
        <>
            <Header />
            <Container
                className="mt-5 text-light"
                style={{ display: "flex", justifyContent: "center" }}
            >
                <Spinner
                    variant="primary"
                    animation="grow"
                    style={{ display: loading ? "block" : "none" }}
                />
                <div
                    style={{
                        width: "35%",
                        display: !loading ? "block" : "none",
                    }}
                >
                    <Form onSubmit={handleSubmit}>
                        <h1 className="text-center mb-3">Create Bill</h1>
                        {alert.variant && (
                            <Alert variant={alert.variant}>
                                {alert.message}
                            </Alert>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Biller Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Biller Name"
                                name="billerName"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Biller Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Biller Email"
                                name="billerEmail"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Biller Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Phone Number"
                                name="phoneNo"
                                required
                            />
                        </Form.Group>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Form.Group
                                className="mb-3"
                                style={{ width: "48%" }}
                            >
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amount"
                                    name="amount"
                                    required
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                style={{ width: "48%" }}
                            >
                                <Form.Label>Amount Paid</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amount Paid"
                                    name="amountPaid"
                                    required
                                    defaultValue={0}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Bill Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                placeholder="Enter Bill Description"
                                name="description"
                                required
                            />
                        </Form.Group>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
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
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default CreateBill;
