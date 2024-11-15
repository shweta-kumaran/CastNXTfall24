import React from "react";
import ColumnFilter from "../../../../app/javascript/components/Filter/ColumnFilter";
import renderer from 'react-test-renderer';


jest.mock('@mui/material/Dialog', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/Select', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/MenuItem', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/FormControl', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/InputLabel', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/TextField', () => () => <input />); // Mock TextField as an input


describe('ColumnFilter', () => {
    const mockApplyFilter = jest.fn();
    const mockOnClose = jest.fn();
    const mockClearFilter = jest.fn();
    const mockHandleColumnChange = jest.fn();
    const columns = [
        { field: 'name', headerName: 'Name', minWidth: 150, type: 'string' },
        { field: 'age', headerName: 'Age', minWidth: 150, type: 'string'  },
      ];

    beforeEach(() => {
    jest.clearAllMocks(); // Clear mock functions before each test
    });

    test('renders correctly when open', () => {
        const tree = renderer.create(<ColumnFilter open={true} columns={columns} onApplyFilter={mockApplyFilter} onClose={mockOnClose} onClearFilter={mockClearFilter}/>).toJSON()
        expect(tree).toMatchSnapshot();
    })
    test('updates state when a column is selected', () => {
        const component = renderer.create(
          <ColumnFilter
            open={true}
            columns={columns}
            onApplyFilter={mockApplyFilter}
            onClose={mockOnClose}
            onClearFilter={mockClearFilter}
          />
        );  
        const instance = component.root
        const selectElement = instance.findByProps({ label: 'Column' });
        selectElement.props.onChange({ target: { value: 'age' } });
        expect(selectElement.props.value).toBe('age');
      });

      test('updates state when a operator is selected', () => {
        const component = renderer.create(
          <ColumnFilter
            open={true}
            columns={columns}
            onApplyFilter={mockApplyFilter}
            onClose={mockOnClose}
            onClearFilter={mockClearFilter}
          />
        );  
        const instance = component.root
        const selectElement = instance.findByProps({ label: 'Operator' });
        selectElement.props.onChange({ target: { value: 'contains' } });
        expect(selectElement.props.value).toBe('contains');
      });

      test('updates state when a operator is selected', () => {
        const component = renderer.create(
          <ColumnFilter
            open={true}
            columns={columns}
            onApplyFilter={mockApplyFilter}
            onClose={mockOnClose}
            onClearFilter={mockClearFilter}
          />
        );  
        const instance = component.root
        const textElement = instance.findByProps({ label: 'Value' });
        textElement.props.onChange({ target: { value: 'Female' } });
        expect(textElement.props.value).toBe('Female');
      });

      test('apply filter', () => {
        const component = renderer.create(
          <ColumnFilter
            open={true}
            columns={columns}
            onApplyFilter={mockApplyFilter}
            onClose={mockOnClose}
            onClearFilter={mockClearFilter}
          />
        );  
        const instance = component.root
        const columnElement = instance.findByProps({ label: 'Column' });
        columnElement.props.onChange({ target: { value: 'age' } });

        const operatorElement = instance.findByProps({ label: 'Operator' });
        operatorElement.props.onChange({ target: { value: 'contains' } });

        const textElement = instance.findByProps({ label: 'Value' });
        textElement.props.onChange({ target: { value: 'Female' } });

        const applyButton = instance.findByProps({ label: 'apply'})
        applyButton.props.onClick()
        expect(textElement.props.value).toBe('Female');

        expect(mockApplyFilter).toHaveBeenCalledWith({
            columnField: 'age',
            operatorValue: 'contains', // Default operator
            value: 'Female',              // Default value
        });
      });

      test('clear filter', () => {
        const component = renderer.create(
          <ColumnFilter
            open={true}
            columns={columns}
            onApplyFilter={mockApplyFilter}
            onClose={mockOnClose}
            onClearFilter={mockClearFilter}
          />
        );  
        const instance = component.root
        const clearButton = instance.findByProps({ label: 'clear'})
        clearButton.props.onClick()

        expect(mockClearFilter).toHaveBeenCalled()
      });
})