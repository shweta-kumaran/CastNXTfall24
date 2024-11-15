import renderer from 'react-test-renderer';
import Header from '../../../../app/javascript/components/Navbar/Header';
import {propsDefault} from '../../__mocks__/props.mock';
import axios from 'axios';

jest.mock('axios');

const mockAppBar = jest.fn();
jest.mock('@mui/material/AppBar', ()=>(props)=>{
    mockAppBar(props);
    return (<mock-AppBar props={props}>{props.children}</mock-AppBar>);
})

const originalProperties = global.properties;
//Object.defineProperty(window, 'alert', { value: (val) => jest.fn(val)})
global.alert = jest.fn();
delete window.location;
window.location = { href: '' };

beforeEach(() =>{
    global.properties = propsDefault.properties;
    jest.clearAllMocks()
})

afterEach(() => {
    global.properties = originalProperties;
});

test('Navbar Load test', ()=>{
    const component = renderer.create(
        <Header />
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('Log Out test - successful logout', async () => {
    axios.get.mockResolvedValueOnce({
        data: { redirect_path: '/home' }
    });

    const component = renderer.create(<Header />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    await renderer.act(async () => {
        component.root.find(el => el.props.id === 'logoutBtn').props.onClick();
    });

    expect(axios.get).toHaveBeenCalledWith('/logout');
    expect(window.location.href).toBe('/home');

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Log Out test - failed logout', async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const component = renderer.create(<Header />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    await renderer.act(async () => {
        component.root.find(el => el.props.id === 'logoutBtn').props.onClick();
    });

    expect(axios.get).toHaveBeenCalledWith('/logout');
    expect(window.alert).toHaveBeenCalledWith(`Error: Could not Logout ${global.properties?.name}`);

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});