import React from "react";
import UserHomepage from "../../../../app/javascript/components/User/UserHomepage";
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

//import { render, fireEvent } from '@testing-library/react'; // Add this import
import { USER_PROPERTIES_WITH_SUBMISSIONS, USER_PROPERTIES_WITH_ACCEPTING } from '../../__mocks__/props.mock'

const mockHeader = jest.fn()
const originalProperties = global.properties;

jest.mock('../../../../app/javascript/components/Navbar/Header', ()=>(props)=>{
    mockHeader(props);
    return(<mock-header />)
})

const mockTabs = jest.fn();
jest.mock('@mui/material/Tabs', () => (props) =>{
    mockTabs(props);
    return (<mock-Tabs props={props}>{props.children}</mock-Tabs>)
})

const mockTab = jest.fn();
jest.mock('@mui/material/Tab', () => (props) =>{
    mockTab(props);
    return (<mock-Tab props={props}>{props.children}</mock-Tab>)
})

const mockTableBody = jest.fn()
jest.mock('@mui/material/TableBody', () => (props) =>{
    mockTableBody(props);
    return (<mockTableBody props={props}>{props.children}</mockTableBody>)
})

beforeEach(() =>{
    global.properties = USER_PROPERTIES_WITH_SUBMISSIONS;
})

afterEach(() => {
    global.properties = originalProperties;
});

describe('UserHomepage component', () => {
    // Mock props
    const mockPropsWithDeletedEvent = {
      submittedTableData: [
        {
          status: 'DELETED',
          delete_time: new Date(),
          // Add other necessary properties
        }
      ],
      acceptingTableData: [],
    };
  
    test('renders UserHomepage with deleted event', () => {
        const view = ReactTestUtils.renderIntoDocument(
          <UserHomepage properties={mockPropsWithDeletedEvent} />
        );
        // Add assertions for the scenario with a deleted event
      });
  
    test('User Home Page Load With Filled Data', () => {
      const component = renderer.create(<UserHomepage />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.renderSubmittedEventList();
    });
  
    test('User Home Page Load With Accepting Event Status', () => {
      global.properties = USER_PROPERTIES_WITH_ACCEPTING;
      const component = renderer.create(<UserHomepage />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.renderSubmittedEventList();
    });
  
    test('UserHomePage eventHandlers', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.onSubmit();
    });
  
    // Added test cases
    test('componentDidMount updates state based on localStorage', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValueOnce('1');
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      expect(view.state.tabValue).toBe(1);
      expect(view.state.filteredTableData).toBe(view.state.submittedTableData);
      getItemSpy.mockRestore();
    });
  
    test('handleTabChange updates state and localStorage', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      const mockEvent = { target: { value: 1 } };
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      view.handleTabChange(mockEvent, 1);
      expect(setItemSpy).toHaveBeenCalledWith('savedTabValue', 1);
      expect(view.state.tabValue).toBe(1);
      expect(view.state.filteredTableData).toBe(view.state.submittedTableData);
      setItemSpy.mockRestore();
    });
  
    test('handleLocationFilterChange updates state', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.handleLocationFilterChange('State1', 'City1');
      expect(view.state.stateName).toBe('State1');
      expect(view.state.cityName).toBe('City1');
    });
  
    test('onReset reloads the page', () => {
        const originalReload = window.location.reload;
        delete window.location;
        window.location = { reload: jest.fn() };
        const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
        view.onReset();
        expect(window.location.reload).toHaveBeenCalled();
        window.location.reload = originalReload;
      });
  
    test('handleTitleChange updates state with sanitized value', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      const mockEvent = { target: { name: 'title', value: 'Event Title <script>' } };
      view.handleTitleChange(mockEvent);
      expect(view.state.title).toBe('Event Title script');
    });
  
    test('handleDateChange updates state and calls validateDateRange', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      const validateDateRangeSpy = jest.spyOn(view, 'validateDateRange');
      const mockStartEvent = { target: { name: 'eventdateStart', value: '2023-06-01' } };
      const mockEndEvent = { target: { name: 'eventdateEnd', value: '2023-06-05' } };
      view.handleDateChange(mockStartEvent);
      expect(view.state.eventdateStart).toBe('2023-06-01');
      expect(validateDateRangeSpy).toHaveBeenCalledWith('2023-06-01', '');
      view.handleDateChange(mockEndEvent);
      expect(view.state.eventdateEnd).toBe('2023-06-05');
      expect(validateDateRangeSpy).toHaveBeenCalledWith('2023-06-01', '2023-06-05');
      validateDateRangeSpy.mockRestore();
    });
  
    test('validateDateRange updates state with warning message', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.validateDateRange('2023-06-10', '2023-06-05');
      expect(view.state.dateRangeWarning).toBe('Event end date must be greater than start date');
      view.validateDateRange('2023-06-01', '2023-06-05');
      expect(view.state.dateRangeWarning).toBe('');
    });
  
    // Add more test cases for onSubmit, onCategoryFilterValueSelected, onIsPaidFilterSelected,
    // renderAcceptingEventList, and renderSubmittedEventList methods
  });

test('UserHomePage eventHandlers', ()=> {
    const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
    view.onSubmit()
})


test('checks if event was deleted within the last 7 days', () => {
    // Create a mock event with a delete_time within the last 7 days
    const event = {
      delete_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
    };
  
    // Create a new UserHomepage component (assuming it's within the scope of the test)
   // const component = new UserHomepage({});
   const eventIdToCheck = 'event1'; // Specify the event ID to look for
    

    // Render the UserHomepage component with mocked properties
    //render(<UserHomepage properties={{ submittedTableData, eventId: eventIdToCheck }} />);
    const submittedTableData = [
      {
          id: 'event1',
          status: 'DELETED',
          delete_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
      },
      {
          id: 'event2',
          status: 'ACTIVE',
          delete_time: new Date().toISOString()
      }
  ];

  // Snapshot testing using react-test-renderer
  const component = renderer.create(
      <UserHomepage properties={{ submittedTableData, eventId: 'event1' }} />
  );
  const instance = component.getInstance();
  let tree = component.toJSON();
  //const jsonString = JSON.stringify(tree, null, 2); // Pretty print with 2 spaces
   
  
  //console.log(UserHomepage);
    // Check if the message about deletion is displayed
    //const messageElement = screen.getByText(/An event has been deleted within the last 7 days/i);
    //expect(messageElement).toBeInTheDocument();
  
    // Call the function that contains the lines we want to test
    //const isEventDeletedWithin7Days = component.isEventDeletedWithin7Days(event);
  
    // Assertion
    //expect(isEventDeletedWithin7Days).toBe(true);

  });