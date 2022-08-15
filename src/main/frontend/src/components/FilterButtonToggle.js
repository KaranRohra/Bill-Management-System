import React from "react";
import { Button } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

function FilterButtonToggle({ children, eventKey, callback }) {

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey)
    );

    return (
        <Button type="button" onClick={decoratedOnClick}>
            {children}
        </Button>
    );
}

export default FilterButtonToggle;
