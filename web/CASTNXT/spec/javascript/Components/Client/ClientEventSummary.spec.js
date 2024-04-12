import renderer from 'react-test-renderer';
import ClientEventSummary from '../../../../app/javascript/components/Client/ClientEventSummary';
import {propsDefault, PROPERTIES_CLIENT_SUMMARY} from '../../__mocks__/props.mock';
import ReactTestUtils from 'react-dom/test-utils';

const mockAppBar = jest.fn();
jest.mock('../../../../app/javascript/components/Navbar/Header')
jest.mock('@mui/material/Paper')
jest.mock('@mui/material/TableContainer', ()=>(props)=>{
    mockAppBar(props);
    return (<mock-table-container props={props}>{props.children}</mock-table-container>);
})

//const originalProperties = global.properties;
Object.defineProperty(window, 'alert', { value: (val) => jest.fn(val)})

/*
afterEach(() => {
    global.properties = originalProperties;
});*/

test('Client Summary Page Table', ()=>{
    //global.properties = PROPERTIES_CLIENT_SUMMARY;
    const component = renderer.create(
        <ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('ClientEventSummary eventHandlers',()=>{
    const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);

    view.updatePreferences();
})


test('Testing the drag end method in this component', () => {
    const reactComponentTestObjectClientEventSummary = new ClientEventSummary({properties: PROPERTIES_CLIENT_SUMMARY});
    const exampleForDrag = {
        destination: { index: 3 },
        source: { index: 2 },
        reason: ""
    };
    reactComponentTestObjectClientEventSummary.onDragEnd(exampleForDrag);
})


const exampleEvent1 = {
      currentTarget: {
         name: 'a',
         style: {backgroundColor: 'white'},
         cursor: 'pointer'
      }
}

const exampleEvent2 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'red'},
       cursor: 'pointer'
    }
}

const exampleEvent3 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'orange'},
       cursor: 'pointer'
    }
}

const exampleEvent4 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'yellow'},
       cursor: 'pointer'
    }
}

const exampleEvent5 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'green'},
       cursor: 'pointer'
    }
}

const exampleEvent6 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'blue'},
       cursor: 'pointer'
    }
}

const exampleEvent7 = {
    currentTarget: {
       name: 'a',
       style: {backgroundColor: 'indigo'},
       cursor: 'pointer'
    }
}



test('testing the onclick style changing method',()=>{
    const reactComponentClassObjectForEventSummary = new ClientEventSummary({properties: PROPERTIES_CLIENT_SUMMARY});
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent1);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent2);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent3);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent4);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent5);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent6);
    reactComponentClassObjectForEventSummary.onClickStyle(exampleEvent7);
})