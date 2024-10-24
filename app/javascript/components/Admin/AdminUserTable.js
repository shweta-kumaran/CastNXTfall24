import React, {Component} from 'react'
import { Paper } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import {DATA_GRID_TYPES_MAP} from '../../utils/DataParser';
import { extendedNumberOperators } from '../../utils/RangeFilter';
import { saveAs } from 'file-saver';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import "./Admin.css";
import axios from "axios";
import { UsStates, getCities} from '../../utils/FormsUtils';
import Button from "@mui/material/Button";
class AdminUserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            properties: props.properties,
            slides: props.properties.data.slides,
            eventTalent: [],
            rows: [],
            columns: [],
            filterModel: {items: []},
            currentTab: props.currentTab,
            currentClient: props.currentClient,
            currentTalents: props.currentTalents
        }
        this.newRow = null;
    }
    
    constructTableData = (eventTalent) => {
      let columns = []
      let rows = []
      let schema = this.props.properties.data.schema.properties
      let currentTab = this.props.currentTab

      // adding the columns
      Object.keys(schema).forEach(key => {
        if(!key.startsWith('file')){
          const type = DATA_GRID_TYPES_MAP[schema[key].type];
          const columnConfig = {field: key, headerName: schema[key].title, minWidth: 150, type};
          if (type === 'number'){
              columnConfig.filterOperators = extendedNumberOperators;
          }
          columns.push(columnConfig);
        }
      })
      if (currentTab != undefined) {
        columns.unshift({field: 'preference', headerName: 'Preference', minWidth: 150, type: 'number', filterOperators: extendedNumberOperators})
        columns.push({field: 'finalized', headerName: 'Status', minWidth: 150, type: 'boolean', renderCell: (params) => params.value ? 'Finalized' : 'Not Finalized'})
        columns.push({field: 'action', headerName: 'Action', minWidth: 150, 
          renderCell: (params) =>{
            let isFinalized = params.row.finalized
            let talentData = eventTalent[params.row.id - 1]
            // console.log(talentData)
            return (<Button onClick={(event) => {event.stopPropagation(); this.props.finalizeTalent(talentData)}} style={{ backgroundColor: isFinalized ? 'red' : 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>{isFinalized ? 'Remove' : 'Finalize'}</Button>)
        }})
      }
      // filling up table with talent data
      console.log(eventTalent)
      eventTalent.forEach((talentData, index) => {
        let row = {}
        row['id'] = index + 1;
        row['uniqId'] = talentData.id;
        row['talentName'] = talentData.name;
        columns.forEach((column) => {
            row[column.field] = ''
            if (column.field == 'preference') {
              row[column.field] = talentData.preference
            }
            if (column.field == 'finalized') {
              row[column.field] = talentData.finalized
            }
            if (talentData.formData[column.field]) {
              row[column.field] = talentData.formData[column.field]
            }
        })
        rows.push(row) 
      })
      return [rows,columns]
    }

    createEventTalentData() {
      let slides = this.props.properties.data.slides
      
      if(this.props.currentTab != undefined) {
        console.log("Client: ", this.props.currentClient)
        console.log("Client Decks: ", this.props.currentTalents)
        console.log("client's talents: ", this.props.currentTalents[this.props.currentClient])
        slides = this.props.currentTalents[this.props.currentClient]
      }
      let eventTalent = []
      for (var key in slides) {
        let talentData = {
          id: key,
          slideId: slides[key].slideId,
          name: slides[key].talentName,
          curated: slides[key].curated,
          formData: slides[key].formData
        }
        if (this.props.currentTab != undefined) {
          talentData.preference = slides[key].preference
          talentData.finalized = slides[key].finalized
        }
        eventTalent.push(talentData)
      }
      // for(var key in slides) {
      //   eventTalent.push({
      //       id: key,
      //       name: slides[key].talentName,
      //       curated: slides[key].curated,
      //       formData: slides[key].formData
      //   })
      // }
      return eventTalent;
    }

    componentDidMount() {
        let eventTalent = this.createEventTalentData()
        console.log(this.props.filter_curated)
        if(this.props.filter_curated) {
          eventTalent=eventTalent.filter(row => row["curated"] === true)
        }
        let [rows,columns] = this.constructTableData(eventTalent)
        this.setState({
            eventTalent: eventTalent,
            rows: rows,
            columns: columns
        })
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps !== this.props) {
        let eventTalent = this.createEventTalentData()
        if(this.props.filter_curated) {
          eventTalent=eventTalent.filter(row => row["curated"] === true)
        }
        let [rows,columns] = this.constructTableData(eventTalent)
        this.setState({
            eventTalent: eventTalent,
            rows: rows,
            columns: columns
        })
      }
    }

    onRowClick = (rowData) => {
      const talentData = this.state.eventTalent[rowData.id-1];
      rowData.row = talentData;
      rowData.row.uniqId = talentData.id;
      rowData.row.talentName = talentData.name;
      this.props.handleRowClick(rowData);
    }

    onFilterModelChange = (model) => {
      this.setState({
        filterModel: model
      })
    }
    addNewRow = () => {
      const newRow = { id: this.state.rows.length + 1, /* 其他初始值 */ };
        this.newRow = newRow; // 更新最新行的变量
        this.setState(prevState => ({
            rows: [...prevState.rows, newRow]
        }));
    }
    handleRowChange = (newData, id) => {
      this.setState(prevState => ({
          rows: prevState.rows.map(row => row.id === id ? newData : row)
      }));
    }
    handleSave = () => {
      // 取得需要发送的数据
      const eventId = window.location.href.split('/').pop();
      console.log("Data to Send: ", this.newRow)
      const dataToSend = this.newRow
  
      if(!dataToSend['state'] || !UsStates.includes(dataToSend['state'])){
        dataToSend['state']="Oregon"
        dataToSend["city"]="Portland"
      }
      if(!dataToSend['city'] || !getCities(dataToSend['state']).includes(dataToSend['city'])){
        dataToSend['city'] = getCities(dataToSend['state'])[0];
      }
      
      if(!dataToSend["talentName"] || !dataToSend["email"]) {
        alert("Name and email should be provided");
        return
      }
      console.log(dataToSend);
      axios.post('/admin/events/'+eventId+'/slides', { aName: dataToSend["talentName"],data: dataToSend })
          .then(res => {
            this.setState({
              status: true,
              message: res.data.comment
          })
          window.location.reload();
        })
        this.state.rows.push(dataToSend)
  }
    handleCellEditCommit = (params) => {
      const { id, field, value } = params;
      this.setState(prevState => {
          const rows = [...prevState.rows];
          const rowIndex = rows.findIndex(row => row.id === id);
          if (rowIndex > -1) {
              const updatedRow = { ...rows[rowIndex], [field]: value };
              rows[rowIndex] = updatedRow;
              // 如果这是新添加的行，则更新 newRow
              if (this.newRow && this.newRow.id === id) {
                  this.newRow = updatedRow;
                  console.log("new row: ", this.newRow)
              }
          }
          console.log(rows)
          return { rows };
      }, () => {
        console.log("State has been updated: ", this.newRow)
        console.log("State rows after update: ", this.state.rows)
      });
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
    
    render() {
        return(
            <div>
                {/* <h4 style={{marginTop: '10px'}}>Registered Users.</h4> */}
                
                <div>
                  <div className="col-md-8 offset-md-2" style={{marginTop: '10px'}}>
                    <Paper>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h4 style={{ margin: 0, flex: 1 }}>{this.props.heading}</h4>
                        <div style={{ marginLeft: 'auto' }}>
                          {/* <button onClick={this.handleDownloadClick}>Download Table</button> */}
                          <IconButton color="primary" aria-label="Download Table" onClick={this.handleDownloadClick}>
                            <SaveAltIcon />
                          </IconButton>
                        </div>
                      </div>
                      <button onClick={this.addNewRow}>Add Row</button>
                      <button onClick={this.handleSave}>Save Data</button>
                      <DataGrid
                        onCellEditCommit={this.handleCellEditCommit}
                        testId='userTableDataGrid'
                        // rows={this.state.rows}
                        // columns={this.state.columns}
                        rows={this.state.rows.map((row, index) => ({
                          ...row,
                          id: index + 1,
                        }))}
                        columns={this.state.columns.map((col) => {
                          // console.log(col)
                          if (col.field === 'paymentLink') {
                            return {
                              ...col,
                              editable: true,
                              renderCell: (params) => (
                                <button
                                  onClick={() => this.handlePayMeLinkClick(params.row.paymentLink)}
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                  {params.value}
                                </button>
                              ),
                            };
                          }
                          return {
                            ...col,
                            editable: true,
                          };
                        })}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        autoHeight
                        onRowClick = {this.onRowClick}
                        filterModel = {this.state.filterModel}
                        onFilterModelChange={(model) => this.onFilterModelChange(model)}
                        getRowClassName= {(params) => 
                          params.row.id % 2 === 0 ? 'even-row' : 'odd-row'
                        }
                      />
                    </Paper>
                  </div>
                    
                </div>
            </div>    
        )
    }
}

export default AdminUserTable