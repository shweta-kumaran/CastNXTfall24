import AdminUserTable from "../../../../app/javascript/components/Admin/AdminUserTable";
import {propsDefault} from '../../__mocks__/props.mock';
import renderer, { act }from 'react-test-renderer';
import { saveAs } from 'file-saver';
// Import necessary utilities from react-test-renderer
// import renderer, { act } from 'react-test-renderer';

/*
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
*/

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
})


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

describe('testing editing cells and saving updated data', () => {
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

    test('testing editing cell data', () => {
        const mockParams = { id: 2, field: 'name', value: 'New Test Name'}
        reactComponentObjectForThisComponent.handleCellEditCommit(mockParams)
        const updatedRows = reactComponentObjectForThisComponent.state.rows
        // reactComponentObjectForThisComponent.update(<AdminUserTable properties={propsDefault.properties} />);
        expect(updatedRows[1]['name']).toBe('New Test Name')
    });

    test('testing adding a new row with data', () => {
        reactComponentObjectForThisComponent.state.newRow = { id: 3}
        // reactComponentObjectForThisComponent.newRow = { id: 3 };
        const params = { id: 3, field: 'name', value: 'Test Name 3' };
        reactComponentObjectForThisComponent.handleCellEditCommit(params);
        const updatedRows = reactComponentObjectForThisComponent.state.rows;
        console.log("updated rows: ", updatedRows)
        console.log("new row: ", reactComponentObjectForThisComponent.state.newRow)
        expect(updatedRows[2]['name']).toBe('Test Name 3')
        expect(updatedRows.find(row => row.id === 3)).toEqual({
            id: newRowId,
            name: 'Test Name 3',
            email: undefined, // Assuming no email was set
        });
    })
});

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
  



