import { updateBillAPI } from "apis/billAPI";
import React from "react";
import { Form, Button, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

function BillDetails({ billIndex, bills, setBills, handleDelete }) {
    const bill = bills[billIndex];

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedBill = {
            billerName: e.target.billerName.value,
            billerEmail: e.target.billerEmail.value,
            phoneNo: e.target.phoneNo.value,
            amount: e.target.amount.value,
            amountPaid: e.target.amountPaid.value,
            description: e.target.description.value,
            billPaid: e.target.billPaid.checked ? true : false,
        };

        updateBillAPI(updatedBill, bill.id)
            .then((response) => {
                toast.success("Bill updated successfully");
                bills[billIndex] = response.data;
                setBills([...bills]);
            })
            .catch((err) => {
                toast.error("Some error occurred");
            });
    };

    return (
        <Container className="text-dark">
            <Form onSubmit={handleUpdate}>
                <Row style={{ display: "flex" }}>
                    <Form.Group className="mb-3 col-4">
                        <Form.Label>Biller Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Biller Name"
                            name="billerName"
                            defaultValue={bill.billerName}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-4">
                        <Form.Label>Biller Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Biller Email"
                            name="billerEmail"
                            required
                            defaultValue={bill.billerEmail}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-4">
                        <Form.Label>Biller Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Phone Number"
                            name="phoneNo"
                            required
                            defaultValue={bill.phoneNo}
                        />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group className="mb-3 col-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Amount"
                            name="amount"
                            defaultValue={bill.amount}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-3">
                        <Form.Label>Amount Paid</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Amount Paid"
                            name="amountPaid"
                            required
                            defaultValue={bill.amountPaid}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-3">
                        <Form.Label>Bill Image</Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="Choose image"
                            name="billImage"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-3">
                        <Form.Label>Bill Paid</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="billPaid"
                            defaultChecked={bill.billPaid}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Bill Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        placeholder="Enter Bill Description"
                        name="description"
                        defaultValue={bill.description}
                        required
                    />
                </Form.Group>
                <Row>
                    <Form.Group className="mb-3 col-4">
                        <Form.Label>Created on</Form.Label>
                        <Form.Control
                            type="text"
                            disabled
                            defaultValue={bill.createdAt}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-4">
                        <Form.Label>Last update on</Form.Label>
                        <Form.Control
                            type="text"
                            disabled
                            defaultValue={bill.updatedAt}
                        />
                    </Form.Group>
                </Row>
                <Button
                    variant="danger"
                    className="m-1"
                    onClick={() => handleDelete(bill.id)}
                >
                    Delete
                </Button>
                <Button variant="primary" className="m-1" type="submit">
                    Update
                </Button>
                <Form.Control
                    type="number"
                    hidden
                    name="id"
                    defaultValue={bill.id}
                />
            </Form>
        </Container>
    );
}

export default BillDetails;
