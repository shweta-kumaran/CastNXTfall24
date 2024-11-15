    import React, {useState} from 'react'
    import Button from "@mui/material/Button";
    import MenuItem from '@mui/material/MenuItem';
    import Select from '@mui/material/Select';
    import FormControl from '@mui/material/FormControl';
    import InputLabel from '@mui/material/InputLabel';
    import TextField from "@mui/material/TextField";
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';

    let ColumnFilter = ({open, columns, onApplyFilter, onClose, onClearFilter}) => {
        const [selectedColumn, setSelectedColumn] = useState(columns[0]?.field || '');
        const [operator, setOperator] = useState('equals');
        const [value, setValue] = useState('');

        const handleColumnChange = (event) => {
            const column = event.target.value;
            setSelectedColumn(column);
            // console.log("Selected column:", column);
        };
        const handleOperatorChange = (event) => {
            const operator = event.target.value;
            setOperator(operator);
            // console.log("Selected operator:", operator);
        };

        const handleValueChange = (event) => {
            const value = event.target.value;
            setValue(value);
            // console.log("Value:", value);
        };
        // const handleOperatorChange = (event) => setOperator(event.target.value);
        // const handleValueChange = (event) => setValue(event.target.value);

        const applyFilter = () => {
            onApplyFilter({
                columnField: selectedColumn,
                operatorValue: operator,
                value: value
            })
            onClose()
        }

        const clearFilter = () => {
            setSelectedColumn(columns[0]?.field || '');
            setOperator('equals');
            setValue('');
            onClearFilter(); // Notify parent to reset rows
            onClose();
        };
        return (
            <div>
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>Filter Columns</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin='normal'>
                            <InputLabel>Column</InputLabel>
                                <Select value={selectedColumn} onChange={handleColumnChange}>
                                    {columns.map((col) => (
                                        <MenuItem key={col.field} value={col.field}>{col.headerName}</MenuItem>
                                    ))}
                                </Select>
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <InputLabel>Operator</InputLabel>
                                <Select value={operator} onChange={handleOperatorChange}>
                                    <MenuItem value="equals">Equals</MenuItem>
                                    <MenuItem value="contains">Contains</MenuItem>
                                </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Value"
                            value={value}
                            onChange={handleValueChange}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={applyFilter}>
                            Apply Filter
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={clearFilter}>Clear Filter</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )

    }

    export default ColumnFilter;