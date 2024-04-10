import AdminEventSummary from "../../../../app/javascript/components/Admin/AdminEventSummary";
import {propsDefault} from '../../__mocks__/props.mock';
import renderer from 'react-test-renderer';


import {defaultDataSchema, defaultUiSchema, getSchema} from '../../../../app/javascript/utils/FormsUtils';


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

global.window.open = jest.fn();

test('AdminEventSummary Load', () =>{
    const component = renderer.create(
        <AdminEventSummary properties = {propsDefault.properties}/>
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})


test('testing the csv file generating functionality', ()=> {
    const reactComponentObjectForThisComponent= new AdminEventSummary({properties: propsDefault.properties});
    const importedFormat = ['someattribute1'];
    expect(reactComponentObjectForThisComponent.convertDataToCSV(importedFormat)).toMatch('s,o,m,e,a,t,t,r,i,b,u,t,e,1');
})


test('testing the payment link mechanism for the paypal version in the successful situation', () => {
    const reactComponentTypeObjectForThisComponent= new AdminEventSummary({properties: propsDefault.properties});
    reactComponentTypeObjectForThisComponent.handlePayMeLinkClick('https://www.paypal.me/thisisjustforthejestunittesting');
    expect(window.open).toHaveBeenCalledWith('https://www.paypal.com/paypalme/thisisjustforthejestunittesting', '_blank');   
})



test('testing the payment link mechanism for the venmo version in the successful situation', () => {
    const reactComponentTypeObjectForThisComponent= new AdminEventSummary({properties: propsDefault.properties});
    reactComponentTypeObjectForThisComponent.handlePayMeLinkClick('https://venmo.com/thisisjustforthejestunittesting');
    expect(window.open).toHaveBeenCalledWith('https://venmo.com/thisisjustforthejestunittesting', '_blank');   
})

// These two tests are just for the course requirement of 90%+ coverage
test('returns default schemas when isPaid is "No"', () => {
    const { dataSchema, uiSchema } = getSchema('No');
    expect(dataSchema).toEqual(defaultDataSchema);
    expect(uiSchema).toEqual(defaultUiSchema);
});

test('adds paymentLink to schemas when isPaid is not "No"', () => {
    const { dataSchema, uiSchema } = getSchema('Yes');
    expect(dataSchema.properties).toHaveProperty('paymentLink');
    expect(dataSchema.properties.paymentLink).toEqual({
        title: "Payment Link",
        type: "string",
        description: "Enter your PayPal or Venmo payment link."
    });
    expect(uiSchema['ui:order']).toContain('paymentLink');
});


