import { updateBillAPI } from "apis/billAPI";
import React from "react";
import { Form, Button, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

function BillDetails({ billIndex, bills, setBills, handleDelete }) {
    const [billImage, setBillImage] = React.useState();
    const bill = bills[billIndex];

    const handleUpdate = (e) => {
        e.preventDefault();
        const formatData = new FormData();
        formatData.append("billerName", e.target.billerName.value);
        formatData.append("billerEmail", e.target.billerEmail.value);
        formatData.append("phoneNo", e.target.phoneNo.value);
        formatData.append("amount", e.target.amount.value);
        formatData.append("amountPaid", e.target.amountPaid.value);
        formatData.append("description", e.target.description.value);
        formatData.append("billPaid", e.target.billPaid.checked ? true : false);
        if (billImage) formatData.append("billImage", billImage);

        updateBillAPI(formatData, bill.id)
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
                        <Form.Label>
                            Bill Image{" "}
                            {bill.billImage && (
                                <>
                                    (
                                    <a
                                        href={
                                            process.env.REACT_APP_BASE_URL +
                                            `/bill/image/${bill.id}/`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Click to view
                                    </a>
                                    )
                                </>
                            )}
                        </Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="Choose image"
                            name="billImage"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) {
                                    setBillImage(null);
                                } else if (file.size > 2 * 1e6)
                                    toast.error(
                                        "Image size should be less than 2MB"
                                    );
                                else setBillImage(e.target.files[0]);
                            }}
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
