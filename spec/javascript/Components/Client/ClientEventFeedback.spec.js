import ClientEventFeedback from "../../../../app/javascript/components/Client/ClientEventFeedback";
import renderer from 'react-test-renderer';
import {PROPERTIES_CLIENT_FEEDBACK} from '../../__mocks__/props.mock';
import {mockBoilerplate} from '../../__mocks__/component.mock'
import ReactTestUtils, { act } from 'react-dom/test-utils';
import axios from "axios";

const mockTabs = jest.fn();
jest.mock("axios")
jest.mock('@mui/material/Table', ()=>(props) =>mockBoilerplate(props, '@mui/material/Table'));
jest.mock('@mui/material/TableCell', ()=>(props)=>mockBoilerplate(props, '@mui/material/TableCell'));
jest.mock('@mui/material/TableContainer', ()=>(props)=>mockBoilerplate(props,'@mui/material/TableContainer'));
jest.mock('@mui/material/TableRow', ()=>(props)=>mockBoilerplate(props,'@mui/material/TableRow'));
jest.mock('@mui/material/TableFooter', ()=>(props)=>mockBoilerplate(props, '@mui/material/TableFooter'));
jest.mock("@mui/material/Paper", ()=>(props)=>mockBoilerplate(props, "@mui/material/Paper"));
jest.mock("@mui/material/TablePagination", ()=>(props)=>mockBoilerplate(props, "@mui/material/TablePagination"));
jest.mock("@mui/material/Button", ()=>(props)=>mockBoilerplate(props,"@mui/material/Button"));
jest.mock("@mui/material/TextField", ()=>(props)=>mockBoilerplate(props, "@mui/material/TextField"));

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
jest.mock('../../../../app/javascript/components/Forms/Slide', () => (props)=>{
    jest.fn(props)
    return (<mock-slide props={props}>{props.children}</mock-slide>)
})

jest.mock('jspdf', () => {
    return jest.fn().mockImplementation(() => {
        return {
            html: jest.fn().mockImplementation((element, options) => {
                options.callback({
                    save: jest.fn()
                })
            }), 
            save: jest.fn()
        }
    })
})

const e = {
    target: {
        name: 'name',
        value:'value'
    }
}

test('ClientEventFeedback Load', ()=>{
    const component = renderer.create(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>)

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('ClientEventFeedback ', ()=>{
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    // view.handleFeedbackChange(e) // TypeError: view.handleFeedbackChange is not a function
    view.handleChangeRowsPerPage(e)
    view.handleChange(e)
    view.handleChangePage(e, 1)
    view.handleClick(e)
    view.handleBlur(e)
})

test('sending message from client', async () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    view.setState({
        messageContent: "hello"
    })
    axios.post.mockResolvedValue({
        data: { message: "message sent successful" }
    })
    await act(async () => {
        await view.sendMessage();
    });
    expect(view.state.disableSubmit).toBe(true)
    expect(view.state.status).toBe(true)
    expect(view.state.message).toBe("message sent successful")
})

test('failed sending message from client', async () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    view.setState({
        messageContent: "hello"
    })
    axios.post.mockRejectedValue({
       response: { status: 403, data: { redirect_path: '/error' }}
    })
    await act(async () => {
        await view.sendMessage();
    });
    expect(view.state.status).toBe(false);
    expect(view.state.message).toBe("Failed to send message!");
})

test('generates pdf', async () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    await act(async () => {
        view.generatePDF(); 
      });
      expect(require('jspdf')).toHaveBeenCalledWith('landscape', 'px', 'a4')

})

test('submitting a comment to producer', async () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    view.setState({
        commentContent: "hello"
    })
    axios.post.mockResolvedValue({
        data: { comment: "comment sent successful" }
    })
    await act(async () => {
        await view.submitComment();
    });
    expect(view.state.disableSubmit).toBe(true)
    expect(view.state.status).toBe(true)
    expect(view.state.message).toBe("comment sent successful")
})

test('failed to submit a comment to producer', async () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    view.setState({
        commentContent: "hello"
    })
    axios.post.mockRejectedValue({
       response: { status: 403, data: { redirect_path: '/error' }}
    })
    await act(async () => {
        await view.submitComment();
    });
    expect(view.state.status).toBe(false);
    expect(view.state.message).toBe("Failed to submit comment!");
})

test('clicking enter comment will clear input', () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    const mockEvent = {
        target: {
          value: "Enter Comment",
        },
      };
    view.handleClick(mockEvent)
    expect(mockEvent.target.value).toBe("");
})

test('if no input, then display Enter Comment', () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    const mockEvent = {
        target: {
          value: "",
        },
      };
    view.handleBlur(mockEvent)
    expect(mockEvent.target.value).toBe("Enter Comment");
})

test('open the chat window', () => {
    const view = ReactTestUtils.renderIntoDocument(<ClientEventFeedback properties={PROPERTIES_CLIENT_FEEDBACK}/>);
    expect(view.state.openChatWindow).toBe(false); 
    act(() => {
        view.openChatWindow(); // First call, should open the chat window
    });
    expect(view.state.openChatWindow).toBe(true);
    act(() => {
        view.openChatWindow(); // Second call, should close the chat window
      });
      expect(view.state.openChatWindow).toBe(false);
})

