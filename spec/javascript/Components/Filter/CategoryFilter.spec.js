import React from "react";
import CategoryFilter from "../../../../app/javascript/components/Filter/CategoryFilter";
import renderer from 'react-test-renderer';

test('CategoryFilter Load', () => {
    const component = renderer.create(<CategoryFilter categoryFilterValueSelected={jest.fn()}></CategoryFilter>)
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test("calls categoryFilterValueSelected with selected value", () => {
    const mockCategoryFilterValueSelected = jest.fn();
    const component = renderer.create(
        <CategoryFilter categoryFilterValueSelected={mockCategoryFilterValueSelected} />
    );
    const instance = component.root;

    const selectElement = instance.findByType("select");
    selectElement.props.onChange({ target: { value: "Music" } });
    expect(mockCategoryFilterValueSelected).toHaveBeenCalledWith("Music");
    selectElement.props.onChange({ target: { value: "Other" } });
    expect(mockCategoryFilterValueSelected).toHaveBeenCalledWith("Other");
})