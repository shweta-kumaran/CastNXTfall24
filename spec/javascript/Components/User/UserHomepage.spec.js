import React from "react";
import UserHomepage from "../../../../app/javascript/components/User/UserHomepage";
import ReactTestUtils, {act} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import axios from "axios";
import ReactDOM from "react-dom";
//import { render, fireEvent } from '@testing-library/react'; // Add this import
import { USER_PROPERTIES_WITH_SUBMISSIONS, USER_PROPERTIES_WITH_ACCEPTING } from '../../__mocks__/props.mock'

const mockHeader = jest.fn()
const originalProperties = global.properties;

jest.mock("axios")
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
    let container;
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

    beforeEach(() => {
      // Initialize the container before each test
      container = document.createElement('div');
      document.body.appendChild(container);
      global.properties = USER_PROPERTIES_WITH_SUBMISSIONS;
    });
  
    afterEach(() => {
      // Clean up after each test
      document.body.removeChild(container);
      container = null;
      jest.clearAllMocks();
    });

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
    test('constructor initializes state with deleted event flag', () => {
      const mockProps = {
        submittedTableData: [
          {
            status: 'DELETED',
            delete_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            title: 'Deleted Event'
          }
        ],
        acceptingTableData: [],
        events_near_user: [],
        user_state: 'Texas',
        user_city: 'Austin'
      };
      
      const component = ReactTestUtils.renderIntoDocument(<UserHomepage {...mockProps} />);
      expect(component.state.eventDeletedFlag).toBeTruthy();
    });

    test('handleDateChange properly validates date ranges', () => {
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      
      // Set start date
      const startEvent = {
        target: {
          name: 'eventdateStart',
          value: '2024-01-01'
        }
      };
      view.handleDateChange(startEvent);
      expect(view.state.eventdateStart).toBe('2024-01-01');
      
      // Set end date before start date
      const endEvent = {
        target: {
          name: 'eventdateEnd',
          value: '2023-12-31'
        }
      };
      view.handleDateChange(endEvent);
      expect(view.state.dateRangeWarning).toBe('Event end date must be greater than start date');
    });

    test('renderEventBoxes displays events correctly', () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event 1',
          category: 'Music',
          date: '2024-12-01',
          location: 'Austin',
          statename: 'Texas',
          ispaid: 'Yes'
        },
        {
          id: 2,
          title: 'Test Event 2',
          category: 'Dance',
          date: '2024-12-02',
          location: 'Dallas',
          statename: 'Texas',
          ispaid: 'No'
        }
      ];
  
      const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
      view.setState({ eventsNearUser: mockEvents });
      
      const result = view.renderEventBoxes();
      expect(result.props.children.length).toBe(2);
    });

  });

test('Selected filter is updated in state', ()=> {
    const mock_prop = {
      name: "test 1",
      acceptingTableData: [],
      categoryFilterTextValue: 'Performing Arts',
      submittedTableData: [
        {
          title: 'Event 1',
          id: 1,
          accepting: true,
          category: 'Fashion',
          status: 'SUBMITTED'
        }
      ]
    }
    const view = ReactTestUtils.renderIntoDocument(<UserHomepage {...mock_prop}/>);
    view.onCategoryFilterValueSelected('Fashion')
    expect(view.state.categoryFilterTextValue).toBe('Fashion')
})

test('Paid filter is updated in state', ()=> {
  const mock_prop = {
    name: "test 1",
    acceptingTableData: [],
    isPaidFilterValue: 'Yes',
    submittedTableData: [
      {
        title: 'Event 1',
        id: 1,
        accepting: true,
        category: 'Fashion',
        status: 'SUBMITTED'
      }
    ]
  }
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage {...mock_prop}/>);
  view.onIsPaidFilterSelected('No')
  expect(view.state.isPaidFilterValue).toBe('No')
})

test('Filter events by category', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({ categoryFilterTextValue: 'Performing Arts'})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(2);
})

test('Filter events by state', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({ stateName: 'Texas'})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(2);
})

test('Filter events by city', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({ cityName: 'Houston'})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(1);
})

test('Filter events by title', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({ title: 'Paris'})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(1);
})

test('Filter by start date', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  const startDate = new Date(2024, 9, 26, 0, 0, 0)
  view.setState({ eventdateStart: startDate})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(2);
})


test('Filter by end date', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  const endDate = new Date(2023, 9, 26, 0, 0, 0)
  view.setState({ eventdateEnd: endDate})
  view.onSubmit()
  expect(view.state.filteredTableData.length).toBe(1);
})

test('Open and close Chat Window when clicked', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({
    eventToMessage: {
      id: 1,
      slideId: 'slide123',
      messages: []
    },
    openChatWindow: false
  })
  expect(view.state.openChatWindow).toBe(false)
  view.openChatWindow()
  expect(view.state.openChatWindow).toBe(true)
})

test('send message successful', async () => {
  delete window.location; 
  window.location = new URL('http://localhost/#/'); 
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({
    eventToMessage: {
      id: 1,
      slideId: 'slide123',
    },
    messageContent: "hello",
    openChatWindow: false
  })
  axios.post.mockResolvedValue({
    data: { comment: "message sent successful" }
  })
  await act(async () => {
    await view.sendMessage();
  });
  expect(view.state.disableSubmit).toBe(true)
  expect(view.state.status).toBe(true)
})

test('failed to send message', async () => {
  delete window.location; 
  window.location = new URL('http://localhost/#/'); 
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  view.setState({
    eventToMessage: {
      id: 1,
      slideId: 'slide123',
    },
    messageContent: "hello",
    openChatWindow: false
  })
  axios.post.mockRejectedValue({
    response: { status: 403, data: { redirect_path: 'http://localhost/#/error' }}
 })
  await act(async () => {
    await view.sendMessage();
  });
  expect(window.location.href).toBe('http://localhost/#/error');
  // expect(view.state.disableSubmit).toBe(false)
//  expect(view.state.status).toBe(true)
  // expect(window.location.href).toBe('http://localhost/#/error');
})

test('handleChange function', () => {
  const view = ReactTestUtils.renderIntoDocument(<UserHomepage />);
  const e = {
    target: {
      name: "inputField",
      value: "yes"
    }
  }
  view.handleChange(e)
  expect(view.state.inputField).toBe("yes");
})
