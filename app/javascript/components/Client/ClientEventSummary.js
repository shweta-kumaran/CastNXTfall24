// app/javascript/components/Client/ClientEventSummary.js
import React, {Component} from "react"
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Ref } from "semantic-ui-react"
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";


class ClientEventSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            properties: props.properties,
            slides: props.properties.data.slides,
            negotiationId: props.properties.data.negotiationId,
            summaryRows: [],
            eventStatus: props.properties.data.status,
            eventId: props.properties.data.id,
            updateSuccess: "",
            status: "",
            message: ""
        }
    }
    
    componentDidMount() {
        let slides = this.props.properties.data.slides
        let finalizedIds = this.props.properties.data.finalizedIds
        console.log("Finalized IDS:" ,finalizedIds)
        let tableRows = []
        // console.log(slides);
        for(var key in slides) {
            // console.log(slides[key]);
            // console.log(slides[key].formData.gender);
            tableRows.push({
                id: key,
                name: slides[key].formData.talentName,
                gender : slides[key].formData.gender,
                birthDate : slides[key].formData.birthDate,
                email : slides[key].formData.email,
                state : slides[key].formData.state,
                city : slides[key].formData.city,
                finalized: finalizedIds.includes(key)
            })
        }
        // console.log(tableRows);
        this.setState({
            summaryRows: tableRows
        })
    }

    onDragEnd = (result) => {
        console.log("Result client: ", result)
        const { destination, source, reason } = result;
        
        if (!destination) {
          return;
        }
    
        const rowsOrdered = Object.assign([], this.state.summaryRows);
        const row = this.state.summaryRows[source.index];
        rowsOrdered.splice(source.index, 1);
        rowsOrdered.splice(destination.index, 0, row);
        
        this.setState({
          summaryRows: rowsOrdered,
        });
    }
    
    getItemStyle = (isDragging, draggableStyle, finalized) => {
        return finalized ? ({
            background: ("lightgreen"),
            ...draggableStyle,
        }) : ({
            background: isDragging && ("lightblue"),
            ...draggableStyle,
        })
    }
    
    updatePreferences = async () => {
        let preferences = []
        
        for(var i=0; i<this.state.summaryRows.length; i++) {
            preferences.push(this.state.summaryRows[i].id)
        }
        
        const payload = {
            intermediateSlides: preferences
        }
        
        const baseURL = window.location.href.split("#")[0]
        try {
            const res = await axios.post(`${baseURL}/negotiations`, payload);
            this.setState({
                status: true,
                message: res.data.comment
            })
        } catch (err) {
            this.setState({
                status: false,
                message: "Failed to update Event Preferences!"
            })
            if (err.response?.status === 403) {
                window.location.href = err.response.data.redirect_path;
            }
        }
        // await axios.post(baseURL + "/negotiations", payload)
        //     .then((res) => {
        //         this.setState({
        //           status: true,
        //           message: res.data.comment
        //         })
        //     })
        //     .catch((err) => {
        //         this.setState({
        //           status: false,
        //           message: "Failed to update Event Preferences!"
        //         })
                
        //         if(err.response.status === 403) {
        //           window.location.href = err.response.data.redirect_path
        //         }
        //     })
    }

    onClickStyle = (event) => {
        const currentCell = event.currentTarget;
        const currentCellStyle = currentCell.style.backgroundColor;

        if (currentCellStyle === 'rgb(255, 255, 255)') {
            currentCell.style.backgroundColor = 'red';
        } 
        else if (currentCellStyle === 'red') {
            currentCell.style.backgroundColor = 'orange';
        }
        else if (currentCellStyle === 'orange') {
            currentCell.style.backgroundColor = 'yellow';
        }
        else if (currentCellStyle === 'yellow') {
            currentCell.style.backgroundColor = 'green';
        }
        else if (currentCellStyle === 'green') {
            currentCell.style.backgroundColor = 'blue';
        }
        else if (currentCellStyle === 'blue') {
            currentCell.style.backgroundColor = 'indigo';
        }
        else if (currentCellStyle === 'indigo') {
            currentCell.style.backgroundColor = 'purple';
        }
        else {
            currentCell.style.backgroundColor = 'rgb(255, 255, 255)';
        }
    }

    sortingRowsByName = () => {
       const { summaryRows } = this.state;
       summaryRows.sort((row1,row2) => row1.name.localeCompare(row2.name));
       this.setState({ summaryRows });
    }

    sortingRowsByEmail = () => {
        const { summaryRows } = this.state;
        summaryRows.sort((row1,row2) => row1.email.localeCompare(row2.email));
        this.setState({ summaryRows });
     }

    sortingRowsByState = () => {
        const { summaryRows } = this.state;
        summaryRows.sort((row1,row2) => row1.state.localeCompare(row2.state));
        this.setState({ summaryRows });
    }

    sortingRowsByCity = () => {
        const { summaryRows } = this.state;
        summaryRows.sort((row1,row2) => row1.city.localeCompare(row2.city));
        this.setState({ summaryRows });
    }

    
    
    render() {
        return(
            <div>
                <div style={{marginTop: "2%", marginBottom: "2%"}}>
                    <span> &#x25A0; Indicate your talent preference by dragging and dropping the rows below</span> <br/>
                    <span>&#x25A0; Try click the data cells to change the color</span> <br/>
                    <span>&#x25A0; You can click the column names (Name, Email, State, City) to perform sorting on the columns</span> 
                </div>
                
                <div className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                    <TableContainer component={Paper} style={{ overflowX: "auto", overflowY: "auto" }}>
                        <Table size="small">
                            <TableHead style={{ backgroundColor: "#3498DB" }}>
                                <TableRow>
                                    <TableCell align="center">Preference</TableCell>
                                    <TableCell align="center" onClick={()=>{this.sortingRowsByName()}} style={{cursor: 'pointer'}}>Name</TableCell>
                                    <TableCell align="center">Gender</TableCell>
                                    <TableCell align="center">BirthDate</TableCell>
                                    <TableCell align="center" onClick={()=>{this.sortingRowsByEmail()}} style={{cursor: 'pointer'}}>Email</TableCell>
                                    <TableCell align="center" onClick={()=>{this.sortingRowsByState()}} style={{cursor: 'pointer'}}>State</TableCell>
                                    <TableCell align="center" onClick={()=>{this.sortingRowsByCity()}} style={{cursor: 'pointer'}}>City</TableCell>
                                </TableRow>
                            </TableHead>
                            
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId="table">
                                    {(provided, snapshot) => (
                                      <Ref innerRef={provided.innerRef}>
                                        <TableBody {...provided.droppableProps}>
                                          {this.state.summaryRows.map((row, idx) => {
                                            return (
                                              <Draggable
                                                draggableId={row.id.toString()}
                                                index={idx}
                                                key={row.id}
                                              >
                                                {(provided, snapshot) => (
                                                <Ref innerRef={provided.innerRef}>
                                                    <TableRow {...provided.draggableProps} {...provided.dragHandleProps}
                                                        style={this.getItemStyle(
                                                          snapshot.isDragging,
                                                          provided.draggableProps.style,
                                                          row.finalized 
                                                        )}
                                                        key={row.id}
                                                    >
                                                        <TableCell align="center">{idx+1}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.name}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.gender}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.birthDate}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.email}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.state}</TableCell>
                                                        <TableCell align="center" style={{backgroundColor: 'rgb(255, 255, 255)', cursor: 'pointer'}} onClick={this.onClickStyle}>{row.city}</TableCell>
                                                    </TableRow>
                                                </Ref>
                                                )}
                                            </Draggable>)
                                          })}
                                          {provided.placeholder}
                                        </TableBody>
                                      </Ref>
                                    )}
                                  </Droppable>
                            </DragDropContext>
                        </Table>
                    </TableContainer>
                    <br />
                    {this.state.eventStatus !== "FINALIZED" &&
                        <Button size="small" variant="contained" onClick={this.updatePreferences}>Update Preferences</Button>
                    }
                    
                    {(this.state.status !== "" && this.state.status) &&
                        <div>
                            <br />
                            <Alert severity="success">{this.state.message}</Alert>
                            <br />
                        </div>
                    }
                    
                    {(this.state.status !== "" && !this.state.status) &&
                        <div>
                            <br />
                            <Alert severity="error">Error: {this.state.message}</Alert>
                            <br />
                        </div>
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default ClientEventSummary