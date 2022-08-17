import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";

function FilterForm(props) {
    const dgt = props.filterData.dateGreaterThan;
    const dlt = props.filterData.dateLessThan;
    const [dateGreaterThan, setDateGreaterThan] = React.useState(
        dgt ? new Date(dgt) : new Date()
    );
    const [dateLessThan, setDateLessThan] = React.useState(
        dlt ? new Date(dlt) : new Date()
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const billPaid = [];
        if (e.target.paidBills.checked) billPaid.push("true");
        if (e.target.unpaidBills.checked) billPaid.push("false");

        const params = e.target;

        window.location.href =
            `/?sortBy=${params.sortBy.value}&search=${params.search.value}&` +
            `amountGreaterThan=${
                params.amountGreaterThan.value || 0
            }&amountLessThan=${
                params.amountLessThan.value || Number.MAX_SAFE_INTEGER
            }&` +
            `dateGreaterThan=${dateGreaterThan.toISOString().slice(0, 10)}&` +
            `dateLessThan=${dateLessThan
                .toISOString()
                .slice(0, 10)}&billPaid=${billPaid.join(",")}`;
    };

    return (
        <Container
            className="text-light p-3 border border-warning"
            style={props.style}
        >
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                name="search"
                                defaultValue={props.filterData.search || ""}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="text"
                                defaultValue="Amount greater than: "
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="number"
                                placeholder="Amount greater than"
                                name="amountGreaterThan"
                                defaultValue={
                                    props.filterData.amountGreaterThan
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="text"
                                defaultValue="Date greater than (IN): "
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <DatePicker
                            selected={dateGreaterThan}
                            onChange={(date) => setDateGreaterThan(date)}
                            className="m-2"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Select
                                name="sortBy"
                                defaultValue={props.filterData.sortBy}
                            >
                                <option value="id desc">Sort By</option>
                                <option value="billerName asc">
                                    Biller Name ASC
                                </option>
                                <option value="billerName desc">
                                    Biller Name DESC
                                </option>
                                <option value="billerEmail asc">
                                    Biller Email ASC
                                </option>
                                <option value="billerEmail desc">
                                    Biller Email DESC
                                </option>
                                <option value="phoneNo asc">
                                    Biller Phone No. ASC
                                </option>
                                <option value="phoneNo desc">
                                    Biller Phone No. DESC
                                </option>
                                <option value="amount asc">
                                    Bill Amount ASC
                                </option>
                                <option value="amount desc">
                                    Bill Amount DESC
                                </option>
                                <option value="isBillPaid asc">
                                    Bill Paid ASC
                                </option>
                                <option value="isBillPaid desc">
                                    Bill Paid DESC
                                </option>
                                <option value="updatedAt asc">
                                    Updated At ASC
                                </option>
                                <option value="updatedAt desc">
                                    Updated At DESC
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="text"
                                defaultValue="Amount less than: "
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="number"
                                placeholder="Amount less than"
                                name="amountLessThan"
                                defaultValue={props.filterData.amountLessThan}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="m-2">
                            <Form.Control
                                type="text"
                                defaultValue="Date less than (EX): "
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <DatePicker
                            selected={dateLessThan}
                            onChange={(date) => setDateLessThan(date)}
                            className="m-2"
                        />
                    </Col>
                </Row>
                <div style={{ display: "flex" }}>
                    <Form.Group className="m-2">
                        <Form.Check
                            type="checkbox"
                            label="Paid Bills"
                            name="paidBills"
                            defaultChecked={
                                props.filterData.billPaid &&
                                props.filterData.billPaid.includes("true")
                            }
                        />
                    </Form.Group>
                    <Form.Group className="m-2">
                        <Form.Check
                            type="checkbox"
                            label="UnPaid Bills"
                            name="unpaidBills"
                            defaultChecked={
                                props.filterData.billPaid &&
                                props.filterData.billPaid.includes("false")
                            }
                        />
                    </Form.Group>
                    <p style={{ marginLeft: "auto" }} className="mt-2">
                        ASC: Ascending, DESC: Descending, IN: Inclusive, EX:
                        Exclusive
                    </p>
                </div>
                <div style={{ display: "flex" }}>
                    <Button className="m-2" type="submit">
                        Apply
                    </Button>
                    <Button
                        className="m-2 btn btn-danger"
                        onClick={() => (window.location.href = "/")}
                    >
                        Clear
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default FilterForm;
