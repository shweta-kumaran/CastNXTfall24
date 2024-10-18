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

test('findAssignedClients returns correct assigned clients', () => {
    const mockProps = {
        ...propsDefault,
        properties: {
            ...propsDefault.properties,
            data: {
                ...propsDefault.properties.data,
                clients: {
                    client1: {
                        name: 'Client1',
                        finalizedIds: [1]
                    },
                    client2: {
                        name: 'Client2',
                        finalizedIds: [1]
                    }
                }
            }
        }
    };
    const reactComponentObjectForThisComponent = new AdminEventSummary({ properties: mockProps.properties });
    const assignedClients = reactComponentObjectForThisComponent.findAssignedClients(1);
    expect(assignedClients).toBe('Client1, Client2');
});

test('findAssignedClients returns empty string when no clients assigned', () => {
    const reactComponentObjectForThisComponent = new AdminEventSummary({properties: propsDefault.properties});
    const assignedClients = reactComponentObjectForThisComponent.findAssignedClients(999); 
    expect(assignedClients).toBe('');
});

test('fetchPaymentStatus fetches and returns updated payment status', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ been_paid: true }),
        })
    );

    const reactComponentObjectForThisComponent = new AdminEventSummary({properties: propsDefault.properties});
    const talentData = { id: 1, beenPaid: false };
    const result = await reactComponentObjectForThisComponent.fetchPaymentStatus(talentData);

    expect(result.beenPaid).toBe(true);
});

test('fetchPaymentStatus handles errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API error'));

    const reactComponentObjectForThisComponent = new AdminEventSummary({properties: propsDefault.properties});
    const talentData = { id: 1, beenPaid: false };
    const result = await reactComponentObjectForThisComponent.fetchPaymentStatus(talentData);

    expect(result.beenPaid).toBe(false);
});
