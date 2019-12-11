import React from 'react'
import {render, fireEvent} from '@testing-library/react';
import CurrentClasses from "./CurrentClasses.js"

test('CurrClasses Render Component Build and Interaction Event', () => {
    let classes = {id: "CS 397", title: "Rapid Prototyping", assignments: ["Testing Activity"]};
    let setClasses = jest.fn();
    let clickButton = jest.fn();

    let key = "CS 397";
    // const {getByTestId} = render(<CurrentClasses key={key} 
    //     state={classes, setClasses} />);

  // expect(getByTestId('Class1').textContent).toBe("Rapid Protoptying");
})