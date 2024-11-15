import AdminUserTable from "../../../../app/javascript/components/Admin/AdminUserTable";
import {propsDefault, CLIENT_DESK_PROP} from '../../__mocks__/props.mock';
import renderer, { act }from 'react-test-renderer';
import { saveAs } from 'file-saver';

jest.mock('@material-ui/data-grid', () => ({
    DataGrid: (props) => {
        jest.fn(props);
        return (<mock-data-grid props={props}>{props.children}</mock-data-grid>);
    },
    getGridNumericColumnOperators: () => []
}));

jest.mock('@material-ui/core', () => ({
    Paper: (props) => {
        jest.fn(props);
        return (<mock-paper props={props}>{props.children}</mock-paper>);
    }
}));

jest.mock('../../../../app/javascript/utils/RangeFilter', () => ({
    extendedNumberOperators: () => []
}));

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

global.window.open = jest.fn();




test('Admin Table Load', () =>{
    const component = renderer.create(
        <AdminUserTable properties = {propsDefault.properties}/>
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('testing the payment link mechanism for the paypal version in the successful situation', () => {
    const reactComponentTypeObjectForThisComponent= new AdminUserTable({properties: propsDefault.properties});
    reactComponentTypeObjectForThisComponent.handlePayMeLinkClick('https://www.paypal.me/thisisjustforthejestunittesting');
    expect(window.open).toHaveBeenCalledWith('https://www.paypal.com/paypalme/thisisjustforthejestunittesting', '_blank');   
})


test('testing the payment link mechanism for the venmo version in the successful situation', () => {
    const reactComponentTypeObjectForThisComponent= new AdminUserTable({properties: propsDefault.properties});
    reactComponentTypeObjectForThisComponent.handlePayMeLinkClick('https://venmo.com/thisisjustforthejestunittesting');
    expect(window.open).toHaveBeenCalledWith('https://venmo.com/thisisjustforthejestunittesting', '_blank');   
})

describe('testing downloading table functionalities', () => {
    let reactComponentObjectForThisComponent
    beforeEach(() => {
        reactComponentObjectForThisComponent = renderer.create(
            <AdminUserTable properties={propsDefault.properties} />
        ).getInstance();
        reactComponentObjectForThisComponent.setState({
            rows: [
                { id: 1, name: 'Test Name 1', email: 'test1@example.com' },
                { id: 2, name: 'Test Name 2', email: 'test2@example.com' },
            ],
        });
    });
    
    test('testing the csv file generating functionality', () => {
        // const reactComponentObjectForThisComponent= new AdminUserTable({properties: propsDefault.properties});
        const importedFormat = [{ id: 1, name: 'John', email: 'john@example.com' }];
        const expectedCSVOutput = 'id,name,email\n1,John,john@example.com';
        expect(reactComponentObjectForThisComponent.convertDataToCSV(importedFormat)).toBe(expectedCSVOutput);
    });

    test('testing download click functionality', () => {
        reactComponentObjectForThisComponent.handleDownloadClick();
        expect(saveAs).toHaveBeenCalledTimes(1);
        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'table_data.csv');
    });
});
// test('testing the csv file generating functionality', ()=> {
//     const reactComponentObjectForThisComponent= new AdminUserTable({properties: propsDefault.properties});
//     const importedFormat = ['someattribute1'];
//     expect(reactComponentObjectForThisComponent.convertDataToCSV(importedFormat)).toMatch('s,o,m,e,a,t,t,r,i,b,u,t,e,1');
// })

test('testing add new row to the table', () => {
    let component;
    act(() => {
        component = renderer.create(
            <AdminUserTable properties={propsDefault.properties} />
        );
    });
    const instance = component.getInstance();
    act(() => {
        instance.setState({ rows: [] });
    });
    act(() => {
        instance.addNewRow();
    });

    expect(instance.state.rows).toHaveLength(1);
    expect(instance.state.rows[0]).toEqual({id: 1,});
});

describe('testing editing cells', () => {
    let reactComponentObjectForThisComponent
    beforeEach(() => {
        reactComponentObjectForThisComponent = renderer.create(
            <AdminUserTable properties={propsDefault.properties} />
        ).getInstance();
        reactComponentObjectForThisComponent.setState({
            rows: [
                { id: 1, name: 'Test Name 1', email: 'test1@example.com' },
                { id: 2, name: 'Test Name 2', email: 'test2@example.com' },
            ],
        });
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });
    afterEach(() => { 
        window.alert.mockRestore();
    });

    test('testing editing cell data', () => {
        const mockParams = { id: 2, field: 'name', value: 'New Test Name'}
        reactComponentObjectForThisComponent.handleCellEditCommit(mockParams)
        const updatedRows = reactComponentObjectForThisComponent.state.rows
        // reactComponentObjectForThisComponent.update(<AdminUserTable properties={propsDefault.properties} />);
        expect(updatedRows[1]['name']).toBe('New Test Name')
    });

    test('testing adding a new row with data', () => {
        reactComponentObjectForThisComponent.addNewRow();
        // reactComponentObjectForThisComponent.newRow = { id: 3 };
        const params = { id: 3, field: 'name', value: 'Test Name 3' };
        reactComponentObjectForThisComponent.handleCellEditCommit(params);
        const updatedRows = reactComponentObjectForThisComponent.state.rows;
        expect(updatedRows[2]['name']).toBe('Test Name 3')
        expect(updatedRows.find(row => row.id === 3)).toEqual({
            id: 3,
            name: 'Test Name 3',
            email: undefined, // Assuming no email was set
        });
    });

    test('testing saving data of new row (no email and name included)', () => {
        reactComponentObjectForThisComponent.addNewRow();
        reactComponentObjectForThisComponent.handleSave();
        expect(window.alert).toHaveBeenCalledWith("Name and email should be provided");
    });
});

describe('AdminUserTable Component', () => {
    let instance;
    beforeEach(() => {
        instance = renderer.create(
            <AdminUserTable properties={propsDefault.properties} />
        ).getInstance();
    });

    test('constructTableData should generate columns and rows from eventTalent data', () => {
        const mockProps = {
            properties: {
                ...propsDefault.properties,
                data: {
                    schema: {
                        properties: {
                            name: { title: 'Name', type: 'string' },
                            preference: { title: 'Preference', type: 'number' }
                        }
                    }
                }
            },
            currentTab: true,
            currentClient: 'client1',
            currentTalents: {
                client1: [
                    {
                        slideId: '1',
                        talentName: 'Test Talent',
                        preference: 1,
                        finalized: false,
                        formData: {}
                    }
                ]
            }
        };
        instance = renderer.create(
            <AdminUserTable {...mockProps} />
        ).getInstance();

        const eventTalent = [
            { 
                id: '1', 
                name: 'Test Talent', 
                preference: 1, 
                finalized: false, 
                formData: {} 
            }
        ];

        const [rows, columns] = instance.constructTableData(eventTalent);

        expect(columns.length).toBeGreaterThan(0);
        expect(columns[0].field).toBe('preference');
        expect(columns.some(col => col.filterOperators)).toBeTruthy();
        expect(rows[0].id).toBe(1); 
        expect(rows[0].talentName).toBe('Test Talent'); 
    });
    

    test('createEventTalentData should return an array of objects with expected fields', () => {
        const mockProps = {
            properties: propsDefault.properties,
            currentTab: true,
            currentClient: 'client1',
            currentTalents: {
                client1: [
                    {
                        slideId: '1',
                        talentName: 'Test Talent',
                        preference: 1,
                        finalized: false,
                        formData: {}
                    }
                ]
            }
        };

        instance = renderer.create(
            <AdminUserTable {...mockProps} />
        ).getInstance();
        const eventTalentData = instance.createEventTalentData();
        expect(Array.isArray(eventTalentData)).toBeTruthy();
        expect(eventTalentData[0]).toHaveProperty('id');
        expect(eventTalentData[0]).toHaveProperty('finalized');
    });

    test('componentDidMount should initialize eventTalent, rows, and columns state', () => {
        instance.componentDidMount();
        expect(instance.state.eventTalent).toBeDefined();
        expect(instance.state.rows).toBeDefined();
        expect(instance.state.columns).toBeDefined();
    });

    test('componentDidUpdate should re-render when props change', () => {
        const newProps = { ...propsDefault, currentTab: 'newTab' };
        instance.componentDidUpdate(newProps);
        expect(instance.state.rows).toBeDefined();
        expect(instance.state.columns).toBeDefined();
    });

    test('onRowClick should call handleRowClick with correct data', () => {
        const mockHandleRowClick = jest.fn();
        instance = renderer.create(
            <AdminUserTable 
                properties={propsDefault.properties}
                handleRowClick={mockHandleRowClick}
            />
        ).getInstance();

        const rowData = { id: 1 };
        instance.onRowClick(rowData);
        expect(mockHandleRowClick).toHaveBeenCalledWith(expect.objectContaining({
            id: 1
        }));
    });

    test('onFilterModelChange should update filterModel state', () => {
        const model = { items: [{ columnField: 'name', operatorValue: 'contains', value: 'test' }] };
        instance.onFilterModelChange(model);
        expect(instance.state.filterModel).toEqual(model);
    });

    test('handleRowChange should update specific row data by ID', () => {
        const newData = { id: 2, name: 'Updated Name' };
        instance.setState({ rows: [{ id: 1, name: 'Name1' }, { id: 2, name: 'Name2' }] });
        instance.handleRowChange(newData, 2);
        expect(instance.state.rows[1].name).toBe('Updated Name');
    });

    test('handleSave should set default state and city if missing', () => {
        instance.newRow = { state: undefined, city: undefined, talentName: 'Test', email: 'test@example.com' };
        instance.handleSave();
        expect(instance.newRow.state).toBe('Oregon');
        expect(instance.newRow.city).toBe('Portland');
    });

    test('handleSave should alert if talentName or email is missing', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        instance.newRow = { talentName: '', email: '' };
        instance.handleSave();
        expect(window.alert).toHaveBeenCalledWith("Name and email should be provided");
        window.alert.mockRestore();
    });

    test('handleCellEditCommit should update rows state correctly', () => {
        const params = { id: 1, field: 'name', value: 'Edited Name' };
        instance.setState({ rows: [{ id: 1, name: 'Old Name' }] });
        instance.handleCellEditCommit(params);
        expect(instance.state.rows[0].name).toBe('Edited Name');
    });

    test('convertDataToCSV should generate correct CSV format from rows', () => {
        const data = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
        const csvData = instance.convertDataToCSV(data);
        expect(csvData).toBe('id,name,email\n1,John Doe,john@example.com');
    });

    test('handleDownloadClick should call saveAs with Blob and filename', () => {
        instance.setState({
            rows: [{ id: 1, name: 'Test Name 1', email: 'test1@example.com' }]
        });
        instance.handleDownloadClick();
        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'table_data.csv');
    });

    test('handlePayMeLinkClick opens correct PayPal URL', () => {
        instance.handlePayMeLinkClick('https://www.paypal.me/testuser');
        expect(window.open).toHaveBeenCalledWith('https://www.paypal.com/paypalme/testuser', '_blank');
    });

    test('handlePayMeLinkClick opens correct Venmo URL', () => {
        instance.handlePayMeLinkClick('https://venmo.com/testuser');
        expect(window.open).toHaveBeenCalledWith('https://venmo.com/testuser', '_blank');
    });

    test('render should display key components and elements', () => {
        const component = renderer.create(<AdminUserTable properties={propsDefault.properties} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('AdminUserTable Filter', () => {
    let instance;
    beforeEach(() => {
        instance = renderer.create(
            <AdminUserTable properties={propsDefault.properties} />
        ).getInstance();
        instance.setState({
            openFilter: false,
            rows: [
                { id: 1, name: 'Test Name 1', email: 'test1@example.com' },
                { id: 2, name: 'Test Name 2', email: 'test2@example.com' },
            ],
        });
    });

    test('applyFilter equals operator', () => {
        const filter = {
            columnField: 'name',
            operatorValue: 'equals',
            value: 'Test Name 2'
        }
        expect(instance.applyFilterToRows(filter).length).toBe(1)
    })

    test('applyFilter contains operator', () => {
        const filter = {
            columnField: 'name',
            operatorValue: 'contains',
            value: 'Test Name'
        }
        expect(instance.applyFilterToRows(filter).length).toBe(2)
    })

    test('updateFilter when no filtered rows', () => {
        const filter = {
            columnField: 'name',
            operatorValue: 'equals',
            value: 'Mary'
        }
        instance.updateFilter(filter)
        expect(instance.state.selectedRows.length).toBe(0)
    })

    test('clear filters', () => {
        const filter = {
            columnField: 'name',
            operatorValue: 'equals',
            value: 'Test Name 2'
        }
        expect(instance.applyFilterToRows(filter).length).toBe(1)
        instance.clearFilter()
        expect(instance.state.rows.length).toBe(4)
    })

    // test('open filter', () => {
    //     instance.setState({
    //         openFilter: false,
    //         openChatWindow: false
    //     })
    //     instance.openFilter()
    //     expect(instance.state.openFilter).toBe(true)
    //     expect(instance.state.openChatWindow).toBe(false)
    // })
})

// test('should correctly find and concatenate assigned clients names', () => {
//     const props = {
//       properties: {
//         data: {
//           clients: {
//             client1: { name: 'Client One', finalizedIds: ['1', '2'] },
//             client2: { name: 'Client Two', finalizedIds: ['2'] },
//             client3: { name: 'Client Three', finalizedIds: ['3'] },
//           }
//         }
//       }
//     };
  
//     act(() => {
//       const component = renderer.create(<AdminEventSummary {...props} />);
//       const instance = component.getInstance();
  
//       // Test different scenarios
//       expect(instance.findAssignedClients('1')).toBe('Client One');
//       expect(instance.findAssignedClients('2')).toBe('Client One, Client Two');
//       expect(instance.findAssignedClients('3')).toBe('Client Three');
//       expect(instance.findAssignedClients('4')).toBe(''); // No clients with this ID
//     });
//   });
  



