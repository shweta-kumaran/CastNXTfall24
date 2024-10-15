import AdminUserTable from "../../../../app/javascript/components/Admin/AdminUserTable";
import {propsDefault} from '../../__mocks__/props.mock';
import renderer from 'react-test-renderer';

// Import necessary utilities from react-test-renderer
import renderer, { act } from 'react-test-renderer';

/*
jest.mock('@mui/x-data-grid',() => ({
    DataGrid: (props) => {
        jest.fn(props);
        return(<mock-data-grid props={props}>{props.children}</mock-data-grid>)
    },
    getGridNumericColumnOperators: () => []
}));
jest.mock('@mui/material', () => ({
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

jest.mock('@mui/x-data-grid', () => ({
    DataGrid: (props) => {
        jest.fn(props);
        return (<mock-data-grid props={props}>{props.children}</mock-data-grid>);
    },
    getGridNumericColumnOperators: () => []
}));

jest.mock('@mui/material', () => ({
    Paper: (props) => {
        jest.fn(props);
        return (<mock-paper props={props}>{props.children}</mock-paper>);
    }
}));

jest.mock('../../../../app/javascript/utils/RangeFilter', () => ({
    extendedNumberOperators: () => []
}));

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


test('testing the csv file generating functionality', ()=> {
    const reactComponentObjectForThisComponent= new AdminUserTable({properties: propsDefault.properties});
    const importedFormat = ['someattribute1'];
    expect(reactComponentObjectForThisComponent.convertDataToCSV(importedFormat)).toMatch('s,o,m,e,a,t,t,r,i,b,u,t,e,1');
})




test('should correctly find and concatenate assigned clients names', () => {
    const props = {
      properties: {
        data: {
          clients: {
            client1: { name: 'Client One', finalizedIds: ['1', '2'] },
            client2: { name: 'Client Two', finalizedIds: ['2'] },
            client3: { name: 'Client Three', finalizedIds: ['3'] },
          }
        }
      }
    };
  
    act(() => {
      const component = renderer.create(<AdminEventSummary {...props} />);
      const instance = component.getInstance();
  
      // Test different scenarios
      expect(instance.findAssignedClients('1')).toBe('Client One');
      expect(instance.findAssignedClients('2')).toBe('Client One, Client Two');
      expect(instance.findAssignedClients('3')).toBe('Client Three');
      expect(instance.findAssignedClients('4')).toBe(''); // No clients with this ID
    });
  });
  



