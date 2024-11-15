import renderer from 'react-test-renderer';
import IsPaidFilter from "../../../../app/javascript/components/Filter/IsPaidFilter";

test('isPaidFilter Load', () => {
    const component = renderer.create(<IsPaidFilter onPaidFilterChanged={jest.fn()}></IsPaidFilter>)
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test("calls isPaidFilterSelected with selected value", () => {
    const mockIsPaidFilterSelected = jest.fn();
    const component = renderer.create(
        <IsPaidFilter isPaidFilterSelected={mockIsPaidFilterSelected} />
    );

    const instance = component.root;
    const selectElement = instance.findByType("select");

    selectElement.props.onChange({ target: { value: "Yes" } });
    expect(mockIsPaidFilterSelected).toHaveBeenCalledWith("Yes");
    selectElement.props.onChange({ target: { value: "No" } });
    expect(mockIsPaidFilterSelected).toHaveBeenCalledWith("No");
})