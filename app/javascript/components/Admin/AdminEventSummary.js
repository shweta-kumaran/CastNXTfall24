import React, {Component} from 'react'
import { Paper, Button } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import {DATA_GRID_TYPES_MAP} from '../../utils/DataParser';
import { extendedNumberOperators } from '../../utils/RangeFilter';
import { saveAs } from 'file-saver';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import "./Admin.css";

class AdminEventSummary extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            properties: props.properties,
            slides: props.properties.data.slides,
            eventTalent: [],
            rows: [],
            columns: []
        }
    }
    
    findAssignedClients = (slideId) => {
      let clients = this.props.properties.data.clients
      let assignedClients = ''
      for(var key in clients) {
        if(clients[key].finalizedIds.indexOf(slideId) !== -1) {
          if (assignedClients === '') {
            assignedClients = clients[key].name
          } else {
            assignedClients = assignedClients + ', ' + clients[key].name
          }
        }
      }
      return assignedClients
    }
    
  fetchPaymentStatus = async (talentData) => {
    try {
      const response = await fetch(`/slides/${talentData.id}/payment_status`);
      const data = await response.json();
      return { ...talentData, beenPaid: data.been_paid };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return talentData;
    }
  };

    constructTableData = (eventTalent) => {
      let columns = [
        { field: 'clients', headerName: 'Clients assigned', minWidth: 200 },
        { field: 'paymentCompleted', headerName: 'Payment Completed', minWidth: 200, type: 'boolean' }
      ]
      let rows = []
      let schema = this.props.properties.data.schema.properties
      Object.keys(schema).forEach(key => {
        let existingColumn = columns.find(column => column.field === key)
        if (!existingColumn && !key.startsWith('file')) {
          const type = DATA_GRID_TYPES_MAP[schema[key].type];
          const columnConfig = {field: key, headerName: schema[key].title, minWidth: 150, type};
          if (type === 'number'){
            columnConfig.filterOperators = extendedNumberOperators;
          }
          columns.push(columnConfig);
        }
      })
      // Add Name Validation for form-data.
      eventTalent.forEach((talentData, index) => {
        let row = {}
        row['id'] = index + 1
        row['slideId'] = talentData.id 
        row['clients'] = this.findAssignedClients(talentData.id)
        row['paymentCompleted'] = talentData.beenPaid || false;
        columns.forEach((column) => {
          if(column.field !== 'clients' && column.field !== 'paymentCompleted') {
            row[column.field] = talentData.formData[column.field] || '';
          }
        });

        if (row['clients'] !== '') {
          rows.push(row)
        }
      })
      return [rows,columns]
    }

    componentDidMount() {
        let slides = this.props.properties.data.slides
        let eventTalent = []

        for(var key in slides) {
            eventTalent.push({
                id: key,
                name: slides[key].talentName,
                curated: slides[key].curated,
                formData: slides[key].formData,
                beenPaid: slides[key].been_paid 
            })
        }

        eventTalent = eventTalent.filter((row) => row['curated'] === true)

    Promise.all(eventTalent.map(talentData => this.fetchPaymentStatus(talentData)))
      .then(updatedEventTalent => {
        let [rows, columns] = this.constructTableData(updatedEventTalent);
        this.setState({
            eventTalent: updatedEventTalent,
            rows: rows,
            columns: columns
        })
      })
      .catch(error => console.error('Error during payment status fetch:', error));
    }

    handleDownloadClick = () => {
      // Convert your data to CSV format
      const csvData = this.convertDataToCSV(this.state.rows);
  
      // Create a Blob with the CSV data
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  
      // Save the Blob as a file
      saveAs(blob, 'table_data.csv');
    };
  
    convertDataToCSV = (data) => {
      // Implement a function to convert your data to CSV format
      const headers = Object.keys(data[0]).join(',');
      const csvRows = data.map((row) => Object.values(row).join(','));
      return `${headers}\n${csvRows.join('\n')}`;
    };

    handlePayMeLinkClick = (payMeLink) => {
      if (payMeLink.includes("paypal.me") || payMeLink.includes("paypal")) {
        // Extract the text after the last "/"
        const parts = payMeLink.split("/");
        const userName = parts[parts.length - 1];
    
        // Construct the PayPal payment URL using the extracted username
        const paymentURL = `https://www.paypal.com/paypalme/${userName}`;
    
        // Redirect the user to the PayPal payment page 
        window.open(paymentURL, "_blank");
      }

      if (payMeLink.includes("venmo.com") || payMeLink.includes("venmo")) {
        // Extract the text after the last "/"
        const parts = payMeLink.split("/");
        const userName = parts[parts.length - 1];
    
        // Construct the Venmo payment URL using the extracted username
        const paymentURL = `https://venmo.com/${userName}`;
    
        // Redirect the user to the Venmo payment page
        window.open(paymentURL, "_blank");
      }
    };

  handlePaymentCompletedToggle = async (id) => {
    const row = this.state.rows.find((row) => row.id === id); // Find row by the internal index
    const updatedPaymentStatus = !row.paymentCompleted;

    if (!row.slideId) { // Ensure we are using the actual slideId
      console.error('Slide ID is undefined for row:', row);
      return;
    }

    console.log('URL:', `/slides/${row.slideId}/update_payment_status`); // Log the URL

    try {
      const response = await fetch(`/slides/${row.slideId}/update_payment_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ been_paid: updatedPaymentStatus }), // Send the new been_paid status
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server error:', text);
        throw new Error(`Failed to update payment status: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        this.setState((prevState) => {
          const updatedRows = prevState.rows.map((row) => {
            if (row.id === id) {
              return { ...row, paymentCompleted: updatedPaymentStatus };
            }
            return row;
          });
          return { rows: updatedRows };
        });
      } else {
        console.error('Failed to update payment status:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    return (
      <div>
        <p>Here you will find a report of mapped clients and talents for a certain event.</p>
        <div>
          <div className="col-md-8 offset-md-2" style={{ marginTop: '10px' }}>
            <Paper>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h4 style={{ margin: 0, flex: 1 }}>Event Summary</h4>
                <div style={{ marginLeft: 'auto' }}>
                  <IconButton color="primary" aria-label="Download Table" onClick={this.handleDownloadClick}>
                    <SaveAltIcon />
                  </IconButton>
                </div>
              </div>
              <DataGrid
                rows={this.state.rows.map((row, index) => ({
                  ...row,
                  id: index + 1
                }))}
                columns={[
                  ...this.state.columns,
                  {
                    field: 'paymentLink',
                    headerName: 'Payment',
                    minWidth: 200,
                    renderCell: (params) => (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<PaymentIcon />}
                        onClick={() => this.handlePayClick(params.row.paymentLink)}
                        style={{ width: '100%' }}
                      >
                        Pay
                      </Button>
                    )
                  },
                  {
                    field: 'paymentCompleted',
                    headerName: 'Payment Completed',
                    minWidth: 250,
                    renderCell: (params) => (
                      <button
                        onClick={() => this.handlePaymentCompletedToggle(params.row.id)}
                        style={{
                          background: params.row.paymentCompleted ? 'green' : 'red',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          padding: '10px'
                        }}
                      >
                        {params.row.paymentCompleted ? 'Completed' : 'Mark as Completed'}
                      </button>
                    )
                  }
                ]}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                getRowClassName={(params) => (params.row.id % 2 === 0 ? 'even-row' : 'odd-row')}
              />
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminEventSummary;