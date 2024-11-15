import LocationFilter from "../../../../app/javascript/components/Filter/LocationFilter";
import renderer from 'react-test-renderer';

jest.mock('@mui/material/FormControl', ()=>(props)=>{
    jest.fn(props)
    return(<mock-fc props={props}>{props.children}</mock-fc>)
})

jest.mock('@mui/material/InputLabel', ()=>(props)=>{
    jest.fn(props)
    return(<mock-ip props={props}>{props.children}</mock-ip>)
})

jest.mock('@mui/material/Select', ()=>(props)=>{
    jest.fn(props)
    return(<mock-select props={props}>{props.children}</mock-select>)
})

jest.mock('@mui/material/MenuItem', ()=>(props)=>{
    jest.fn(props)
    return(<mock-menu props={props}>{props.children}</mock-menu>)
})

jest.mock("../../../../app/javascript/utils/FormsUtils", () => ({
    UsStates: ["California", "Texas"],
    getCities: jest.fn().mockImplementation((state) => {
        return state === "California" ? ["Los Angeles", "San Francisco"] : ["Houston", "Dallas"];
    })
}))

test('Component Load for LocationFilter', ()=>{
    const component = renderer.create(<LocationFilter handleLocationFilterChange={jest.fn()}></LocationFilter>)
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test("calls handleLocationFilterChange with selected state and city", () => {
    const mockHandleLocationFilterChange = jest.fn();
    const component = renderer.create(
        <LocationFilter handleLocationFilterChange={mockHandleLocationFilterChange} />
    );

    const instance = component.root;
    const stateSelect = instance.findByProps({ id: "state-select" });
    stateSelect.props.onChange({ target: { value: "California" } });
    expect(mockHandleLocationFilterChange).toHaveBeenCalledWith("California", null);
    const citySelect = instance.findByProps({ id: "city-select" });
    citySelect.props.onChange({ target: { value: "Los Angeles" } });
    expect(mockHandleLocationFilterChange).toHaveBeenCalledWith("California", "Los Angeles");
})