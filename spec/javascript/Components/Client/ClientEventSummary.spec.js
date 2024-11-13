import renderer from 'react-test-renderer';
import ClientEventSummary from '../../../../app/javascript/components/Client/ClientEventSummary';
import {propsDefault, PROPERTIES_CLIENT_SUMMARY} from '../../__mocks__/props.mock';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import axios from "axios";

const mockAppBar = jest.fn();
jest.mock('../../../../app/javascript/components/Navbar/Header')
jest.mock('@mui/material/Paper')
jest.mock('@mui/material/TableContainer', ()=>(props)=>{
    mockAppBar(props);
    return (<mock-table-container props={props}>{props.children}</mock-table-container>);
})
jest.mock("axios")
const mockedAxios = axios;
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

// test('ClientEventSummary eventHandlers',()=>{
//     const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);

//     view.updatePreferences();
// })



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
    const objectForEventSummary = new ClientEventSummary({properties: PROPERTIES_CLIENT_SUMMARY});
    objectForEventSummary.onClickStyle(exampleEvent1);
    objectForEventSummary.onClickStyle(exampleEvent2);
    expect(exampleEvent2.currentTarget.style.backgroundColor).toEqual('orange');

    objectForEventSummary.onClickStyle(exampleEvent3);
    expect(exampleEvent3.currentTarget.style.backgroundColor).toEqual('yellow');

    objectForEventSummary.onClickStyle(exampleEvent4);
    expect(exampleEvent4.currentTarget.style.backgroundColor).toEqual('green');

    objectForEventSummary.onClickStyle(exampleEvent5);
    expect(exampleEvent5.currentTarget.style.backgroundColor).toEqual('blue');

    objectForEventSummary.onClickStyle(exampleEvent6);
    expect(exampleEvent6.currentTarget.style.backgroundColor).toEqual('indigo');

    objectForEventSummary.onClickStyle(exampleEvent7);
    expect(exampleEvent7.currentTarget.style.backgroundColor).toEqual('purple');

})


test('testing the sorting method', ()=>{
    const objectForSortingTesting = new ClientEventSummary({properties: PROPERTIES_CLIENT_SUMMARY});
    objectForSortingTesting.state.summaryRows = [
       {
          "name": "cc",
          "email": "ccccccc@ccccccc.ccc",
          "state": "stateJustForTestingOne",
          "city": "cityJustForTestingOne"
       },
       {
        "name": "aa",
        "email": "aaaaaaa@aaaaaaa.aaa",
        "state": "stateJustForTestingTwo",
        "city": "cityJustForTestingTwo"
       }
    ];

    objectForSortingTesting.sortingRowsByName();
    expect(objectForSortingTesting.state.summaryRows).toEqual([
        {
            "name": "aa",
            "email": "aaaaaaa@aaaaaaa.aaa",
            "state": "stateJustForTestingTwo",
            "city": "cityJustForTestingTwo"
        },
        {
            "name": "cc",
            "email": "ccccccc@ccccccc.ccc",
            "state": "stateJustForTestingOne",
            "city": "cityJustForTestingOne"
         }
    ]);

    objectForSortingTesting.sortingRowsByEmail();
    expect(objectForSortingTesting.state.summaryRows).toEqual([
        {
            "name": "aa",
            "email": "aaaaaaa@aaaaaaa.aaa",
            "state": "stateJustForTestingTwo",
            "city": "cityJustForTestingTwo"
        },
        {
            "name": "cc",
            "email": "ccccccc@ccccccc.ccc",
            "state": "stateJustForTestingOne",
            "city": "cityJustForTestingOne"
         }
    ]);

    objectForSortingTesting.sortingRowsByState();
    expect(objectForSortingTesting.state.summaryRows).toEqual([
        {
            "name": "cc",
            "email": "ccccccc@ccccccc.ccc",
            "state": "stateJustForTestingOne",
            "city": "cityJustForTestingOne"
        },
        {
            "name": "aa",
            "email": "aaaaaaa@aaaaaaa.aaa",
            "state": "stateJustForTestingTwo",
            "city": "cityJustForTestingTwo"
        }
    ]);

    objectForSortingTesting.sortingRowsByCity();
    expect(objectForSortingTesting.state.summaryRows).toEqual([
        {
            "name": "cc",
            "email": "ccccccc@ccccccc.ccc",
            "state": "stateJustForTestingOne",
            "city": "cityJustForTestingOne"
        },
        {
            "name": "aa",
            "email": "aaaaaaa@aaaaaaa.aaa",
            "state": "stateJustForTestingTwo",
            "city": "cityJustForTestingTwo"
        }
    ]);
})

test('dragging talents in table',()=>{
    const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);
    const testResult = {
        destination: {droppableId: "table", index: 1},
        draggableId: "6371988eed22d5ed037d39d0",
        mode: "FLUID",
        reason: "DROP",
        source: {droppableId: "table", index: 0},
        type: "DEFAULT"
    }

    expect(view.state.summaryRows[0].id).toEqual("6371988eed22d5ed037d39d0")
    view.onDragEnd(testResult)
    expect(view.state.summaryRows[0].id).toEqual("6371988eed22d5ed037d49d1")
})

test('dragging talents in table invalid destination',()=>{
    const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);
    const testResult = {
        destination: null,
        draggableId: "6371988eed22d5ed037d39d0",
        mode: "FLUID",
        reason: "DROP",
        source: {droppableId: "table", index: 0},
        type: "DEFAULT"
    }
    // expect(view.state.summaryRows).toEqual("6371988eed22d5ed037d39d0")
    expect(view.state.summaryRows[0].id).toEqual("6371988eed22d5ed037d39d0")
    view.onDragEnd(testResult)
    // expect(view.state.summaryRows).toEqual("6371988eed22d5ed037d39d0")
    expect(view.state.summaryRows[0].id).toEqual("6371988eed22d5ed037d39d0")
})

test('successful in updating preferences', async () => {
    // global.window = Object.create(window);
    // global.confirm = () => true
    // const url = "http://dummy.com";
    // Object.defineProperty(window, 'location', {value: {href: url}});
    const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);
    mockedAxios.post.mockResolvedValue({
        data: { comment: "Update successful" },
        response: {
            status: 200
        }
    });
    // await view.updatePreferences()
    await act(async () => {
        await view.updatePreferences();
    });
    expect(view.state.status).toBe(true)
    expect(view.state.message).toBe("Update successful")
})

// test('update preference should redirect on 403 error', async () => {
//     delete window.location;
//     window.location = { href: "" };
//     // const view = ReactTestUtils.renderIntoDocument(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY}/>);
//     const component = renderer.create(<ClientEventSummary properties={PROPERTIES_CLIENT_SUMMARY} />);
//     const instance = component.getInstance();
//     mockedAxios.post.mockRejectedValueOnce({
//         response: {
//             status: 403,
//             data: {redirect_path: "/redirect-url"}
//         }
//     })
//     await act(async () => {
//         await instance.updatePreferences();
//     });
//     expect(view.state.status).toBe(false);
//     expect(view.state.message).toBe("Failed to update Event Preferences!");
//     expect(window.location.href).toBe("/redirect-url");
// })

// describe('testing onClick functions for sorting various columns', () => {
//     let view;

//     beforeEach(() => {
//         view = renderer.create(<ClientEventSummary properties = {PROPERTIES_CLIENT_SUMMARY} />);
//     });
//     test('sorts rows by name when click on Name header', () => {
//         const instance = view.root;
//         const nameHeader = instance.findByProps({ children: 'Name'})
//         act (() => {
//             ReactTestUtils.Simulate.click(nameHeader)
//         })
//         expect(instance.instance.state.summaryRows[0].talentName).toBe('alex');
//     })
// })