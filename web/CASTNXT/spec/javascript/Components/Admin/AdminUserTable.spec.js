import AdminUserTable from "../../../../app/javascript/components/Admin/AdminUserTable";
import {propsDefault} from '../../__mocks__/props.mock';
import renderer from 'react-test-renderer';


jest.mock('@material-ui/data-grid',() => ({
    DataGrid: (props) => {
        jest.fn(props);
        return(<mock-data-grid props={props}>{props.children}</mock-data-grid>)
    },
    getGridNumericColumnOperators: () => []
}));
jest.mock('@material-ui/core', () => ({
    Paper: (props) => {
        jest.fn(props)
        return (<mock-paper props={props}>{props.children}</mock-paper>)
    }
}))

jest.mock('../../../../app/javascript/utils/RangeFilter' , () => ({
    extendedNumberOperators: () => []
}))


global.window.open = jest.fn();

test('Admin Table Load', () =>{
    const component = renderer.create(
        <AdminUserTable properties = {propsDefault.properties}/>
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})


test('testing the payment link mechanism for the paypal version in the successful situation', () => {
    const reactComponentTypeObjectForThisComponent= new AdminEventSummary({properties: propsDefault.properties});
    reactComponentTypeObjectForThisComponent.handlePayMeLinkClick('https://www.paypal.me/thisisjustforthejestunittesting');
    expect(window.open).toHaveBeenCalledWith('https://www.paypal.com/paypalme/thisisjustforthejestunittesting', '_blank');   
})


test('testing the csv file generating functionality', ()=> {
    const reactComponentObjectForThisComponent= new AdminEventSummary({properties: propsDefault.properties});
    const importedFormat = ['someattribute1'];
    expect(reactComponentObjectForThisComponent.convertDataToCSV(importedFormat)).toMatch('s,o,m,e,a,t,t,r,i,b,u,t,e,1');
})