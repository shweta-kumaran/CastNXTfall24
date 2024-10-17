import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import PaymentIcon from '@mui/icons-material/Payment';
import "./Admin.css";

class AdminPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientOptions: [],
      selectedClient: '',
      rows: [],
      columns: [
        { field: 'name', headerName: 'Client Name', minWidth: 150 },
        { field: 'email', headerName: 'Email', minWidth: 150 },
        { field: 'state', headerName: 'State', minWidth: 150 },
        { field: 'amountDue', headerName: 'Amount Due', minWidth: 150 },
        { field: 'actions', headerName: 'Actions', minWidth: 150, renderCell: this.renderPaymentButton }
      ],
      eventTalent: [],
    };
  }

  componentDidMount() {
    const { clients, slides } = this.props.properties.data;

    let clientOptions = [];
    let eventTalent = [];

    for (let clientId in clients) {
      if (clients[clientId].finalizedIds && clients[clientId].finalizedIds.length > 0) {
        clientOptions.push(
          <MenuItem key={clientId} value={clientId}>{clients[clientId].name}</MenuItem>
        );
      }
    }

    for (let key in slides) {
      if (slides[key].curated) {  
        eventTalent.push({
          id: key,
          name: slides[key].talentName,
          email: slides[key].formData?.email || '',
          state: slides[key].formData?.state || '',
          curated: slides[key].curated,
          formData: slides[key].formData,
          paymentLink: slides[key].formData?.paymentLink || 'https://example.com/payment' 
        });
      }
    }

    this.setState({
      clientOptions,
      eventTalent
    });
  }


  constructTableData = (eventTalent) => {
    let rows = [];

    eventTalent.forEach((talentData, index) => {
      let row = {
        id: index + 1,
        name: talentData.name,
        email: talentData.email || '',
        state: talentData.state || '',
        amountDue: `$100`,  // HOW ARE VALUES DETERMINED??
        paymentLink: talentData.paymentLink 
      };
      rows.push(row);
    });

    return rows;
  };

  handlePayClick = (paymentLink) => {
    window.open(paymentLink, '_blank');
  };

  renderPaymentButton = (params) => {
    return (
      <Button
        variant="contained"
        color="primary"
        endIcon={<PaymentIcon />}
        onClick={() => this.handlePayClick(params.row.paymentLink)}
      >
        Pay
      </Button>
    );
  };

  handleClientChange = (clientSelection) => {
    const { clients } = this.props.properties.data;
    const selectedClient = clientSelection.target.value;
    
    // Get only finalized IDs for the selected client
    const finalizedIds = clients[selectedClient]?.finalizedIds || [];

    // Filter event talents based on finalized status
    const selectedEventTalents = this.state.eventTalent.filter(talentData => 
      finalizedIds.includes(talentData.id)  // Check if the talent ID is in the finalized IDs list
    );

    const rows = this.constructTableData(selectedEventTalents);

    this.setState({
      selectedClient,
      rows
    });
};

  render() {
    return (
      <div>
        <h4 style={{ marginTop: '10px' }}>Finalized Client Payments</h4>
        <FormControl variant="standard">
          <p>Select a client below to view their finalized deck and make payments</p>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={this.state.selectedClient}
            onChange={this.handleClientChange}
            label="Select Client"
            autoWidth
          >
            {this.state.clientOptions}
          </Select>
        </FormControl>
        <div>
          <div className="col-md-8 offset-md-2" style={{ marginTop: '10px' }}>
            <Paper>
              <DataGrid
                rows={this.state.rows}
                columns={this.state.columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                getRowClassName={(params) =>
                  params.row.id % 2 === 0 ? 'even-row' : 'odd-row'
                }
              />
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPayment;

