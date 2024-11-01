import AdminEventSummary from "../../../../app/javascript/components/Admin/AdminEventSummary";
import {propsDefault} from '../../__mocks__/props.mock';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { saveAs } from 'file-saver';
import {defaultDataSchema, defaultUiSchema, getSchema} from '../../../../app/javascript/utils/FormsUtils';
// import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
global.fetch = jest.fn();

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

global.setImmediate = (callback) => setTimeout(callback, 0);
// jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

global.window.open = jest.fn();
global.fetch = jest.fn();

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

test('convertDataToCSV converts data to CSV format', () => {
    const reactComponentObjectForThisComponent = new AdminEventSummary({ properties: propsDefault.properties });
    const data = [
        { id: 1, name: 'Test1', paymentCompleted: true },
        { id: 2, name: 'Test2', paymentCompleted: false },
    ];
    const csvOutput = reactComponentObjectForThisComponent.convertDataToCSV(data);

    expect(csvOutput).toBe('id,name,paymentCompleted\n1,Test1,true\n2,Test2,false');
});


jest.mock('../../../../app/javascript/utils/DataParser', () => ({
    DATA_GRID_TYPES_MAP: {
        'string': 'string',
        'number': 'number',
        'boolean': 'boolean'
    }
}));

test('constructTableData creates correct table structure and data', () => {
    const mockSchemaProps = {
        properties: {
            data: {
                schema: {
                    properties: {
                        name: { type: 'string', title: 'Name' },
                        email: { type: 'string', title: 'Email' },
                        amount: { type: 'number', title: 'Amount' }
                    }
                },
                clients: {
                    client1: {
                        name: 'Test Client',
                        finalizedIds: ['123']
                    }
                }
            }
        }
    };

    const reactComponentObjectForThisComponent = new AdminEventSummary(mockSchemaProps);
    const testEventTalent = [{
        id: '123',
        formData: {
            name: 'Test Talent',
            email: 'test@example.com',
            amount: 100
        },
        beenPaid: false
    }];

    const [rows, columns] = reactComponentObjectForThisComponent.constructTableData(testEventTalent);
    
    // Individual column tests for better error messages
    const clientsColumn = columns.find(col => col.field === 'clients');
    expect(clientsColumn).toEqual({
        field: 'clients',
        headerName: 'Clients assigned',
        minWidth: 200
    });

    const paymentCompletedColumn = columns.find(col => col.field === 'paymentCompleted');
    expect(paymentCompletedColumn).toEqual({
        field: 'paymentCompleted',
        headerName: 'Payment Completed',
        minWidth: 200,
        type: 'boolean'
    });

    const nameColumn = columns.find(col => col.field === 'name');
    expect(nameColumn).toEqual({
        field: 'name',
        headerName: 'Name',
        minWidth: 150,
        type: 'string'
    });

    const emailColumn = columns.find(col => col.field === 'email');
    expect(emailColumn).toEqual({
        field: 'email',
        headerName: 'Email',
        minWidth: 150,
        type: 'string'
    });

    const amountColumn = columns.find(col => col.field === 'amount');
    // Log the actual amount column for debugging
    console.log('Amount column:', amountColumn);
    
    // Test row structure
    expect(rows[0]).toEqual(
        expect.objectContaining({
            id: 1,
            clients: 'Test Client',
            name: 'Test Talent',
            email: 'test@example.com',
            amount: 100,
            paymentCompleted: false
        })
    );
});

test('handleDownloadClick triggers file download', () => {
    const component = new AdminEventSummary({ properties: propsDefault.properties });
    component.state.rows = [{ id: 1, name: 'Test', paymentCompleted: true }];

    component.handleDownloadClick();

    expect(saveAs).toHaveBeenCalledTimes(1); // Ensures saveAs was called
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'table_data.csv'); // Confirms file name and Blob format
});

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('AdminEventSummary Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('fetchPaymentStatus updates beenPaid correctly when API returns data', async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ been_paid: true })
        });

        const component = new AdminEventSummary({ properties: propsDefault.properties });
        const talentData = { id: 1, beenPaid: false };

        const result = await component.fetchPaymentStatus(talentData);

        expect(result.beenPaid).toBe(true);
        expect(global.fetch).toHaveBeenCalledWith(`/slides/1/payment_status`);
    });

    // test('constructTableData handles event talent and schema properties correctly', () => {
    //     const component = new AdminEventSummary({ properties: propsDefault.properties });
    //     const eventTalent = [
    //         {
    //             id: '123',
    //             formData: { name: 'Test' },
    //             beenPaid: true,
    //             curated: true // Ensuring curated is true for filtering
    //         },
    //     ];

    //     const [rows, columns] = component.constructTableData(eventTalent);

    //     // Expect the first row to have id, clients, name, and paymentCompleted properties
    //     expect(rows[0]).toEqual(
    //         expect.objectContaining({
    //             id: 1,
    //             clients: '',
    //             name: 'Test',
    //             paymentCompleted: true,
    //         })
    //     );

    //     // Expect the columns to include specific fields and types
    //     expect(columns).toEqual(
    //         expect.arrayContaining([
    //             expect.objectContaining({ field: 'name', type: 'string' }),
    //             expect.objectContaining({ field: 'paymentCompleted', type: 'boolean' })
    //         ])
    //     );
    // });

    // test('handlePaymentCompletedToggle toggles payment status on success', async () => {
    //     global.fetch.mockResolvedValue({
    //         ok: true,
    //         json: jest.fn().mockResolvedValue({ success: true })
    //     });

    //     const component = renderer.create(<AdminEventSummary properties={propsDefault.properties} />);
    //     const instance = component.getInstance();

    //     // Ensure slideId is set for the row to mock an actual update
    //     instance.setState({
    //         rows: [
    //             { id: 1, slideId: '123', paymentCompleted: false }
    //         ]
    //     });

    //     await act(async () => {
    //         await instance.handlePaymentCompletedToggle(1);
    //     });

    //     const updatedRow = instance.state.rows.find(row => row.id === 1);
    //     expect(updatedRow.paymentCompleted).toBe(true);  // Confirm the state update
    // });   

    // test('handlePaymentCompletedToggle handles API error gracefully', async () => {
    //     global.fetch.mockRejectedValueOnce(new Error('Network error'));

    //     const component = renderer.create(<AdminEventSummary properties={propsDefault.properties} />);
    //     const instance = component.getInstance();

    //     // Set a slideId for the row to trigger the fetch call in handlePaymentCompletedToggle
    //     instance.setState({
    //         rows: [
    //             { id: 1, slideId: '123', paymentCompleted: false }
    //         ]
    //     });

    //     await act(async () => {
    //         await instance.handlePaymentCompletedToggle(1);
    //     });

    //     expect(console.error).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Network error'));
    // });
});