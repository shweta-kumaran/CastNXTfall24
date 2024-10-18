import React, {Component} from "react"
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import Button from "@mui/material/Button";
import axios from "axios";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import Slide from "../Forms/Slide";

class AdminClientDecks extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            client: "",
            clientOptions: [],
            clientList: props.properties.data.clients,
            clientDecks: {},
            slides: props.properties.data.slides,
            schema: props.properties.data.schema !== undefined ? props.properties.data.schema : [],
            uiSchema: props.properties.data.uischema !== undefined ? props.properties.data.uischema : [],
            page:0,
            rowsPerPage: 1,
            expandSlides: false,
            openChatWindow: false,
            message: "",
            status: "",
            clientComments: {},
            commentContent: "",
            clientMessages: {},
            messageContent: "",
            disableSubmit: false
        }
    } 
    
    componentDidMount = () => {
        let clientOptions = []
        let clients = this.state.clientList
        let slides = this.state.slides
        let clientDecks = {}
        let clientComments = {}
        let clientSlideComments = {}
        let clientMessages = {}
        
        
        for(var key in clients) {
          if(clients[key].slideIds.length > 0) {
            clientOptions.push(
                <MenuItem key={key} value={key}>{clients[key].name}</MenuItem>    
            )
            
            clientDecks[key] = []
            clientComments[key] = []

            clients[key].finalizedIds = clients[key].finalizedIds === null ? [] : clients[key].finalizedIds 
            clientMessages[key] = clients[key].messages === null ? [] : clients[key].messages 
            for(var i=0; i<clients[key].slideIds.length; i++) {
              clientDecks[key].push({
                ...this.state.slides[clients[key].slideIds[i]],
                slideId: clients[key].slideIds[i],
                finalized: clients[key].finalizedIds.includes(clients[key].slideIds[i]),
                preference: (i+1),
                preferenceSubmitted: clients[key].preferenceSubmitted
              })

              clientSlideComments = []

              if (slides[clients[key].slideIds[i]].comments) {
                // TypeError: Cannot read properties of undefined (reading 'length')
                for(var j=0; j<slides[clients[key].slideIds[i]].comments.length; j++){
                  // console.log(this.state.slides[clients[key].slideIds[i]].comments[j].commentClient)
                  // console.log(key)
                  if (slides[clients[key].slideIds[i]].comments[j].commentClient === key){
                  // console.log("haha")
                  clientSlideComments.push(
                    slides[clients[key].slideIds[i]].comments[j]
                  )}
                }
                clientComments[key].push(clientSlideComments)
              }
            } 
          }
        }
        
        this.setState({
            clientOptions: clientOptions,
            clientDecks: clientDecks,
            clientComments: clientComments,
            clientMessages: clientMessages
        })
    }
    
    handleClientChange = (clientSelection) => {
        this.setState({
            client: clientSelection.target.value,
            expandSlides: false,
            openChatWindow: false
        })
    }
    
    handleChangePage = (event, newPage) => {
      this.setState({
        page: newPage
      })
    };
    
    handleChangeRowsPerPage = (event, num) => {
      this.setState({
        rowsPerPage: event.target.value
      })
    }

    handleChange = (e, value) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleClick = (e) => {
      if (e.target.value === "Enter Comment") {
        e.target.value = "";
      }
    };
    handleBlur = (e) => {
      
      if (e.target.value === "") {
        e.target.value = "Enter Comment";
      }
    };
  
    
    expandSlides = () => {
      this.setState({
        expandSlides: !this.state.expandSlides
      })
    }

    openChatWindow = () => {
      this.setState({
        openChatWindow: !this.state.openChatWindow
      })
    }
    
    updateFinalizedForClient = (client, clientDecks, finalizedSlides) => {
      const payload = {
        client_id: client,
        finalSlides: finalizedSlides
      }
      
      const baseURL = window.location.href.split("#")[0]
      
      axios.post(baseURL + "/negotiations", payload)
        .then((res) => {
          this.props.properties.data.clients[client].finalizedIds = finalizedSlides
          
          this.setState({
            status: true,
            message: res.data.comment
          })
        })
        .catch((err) => {
          this.setState({
            status: false,
            message: "Failed to Finalize Talent!"
          })
          
          if(err.response.status === 403) {
            window.location.href = err.response.data.redirect_path
          }
        })
    }
    
    finalizeTalent = (talent) => {
      let client = this.state.client
      let clientDecks = this.state.clientDecks
      let finalizedSlides = []
      
      

      for(var i=0; i<clientDecks[client].length; i++) {
        if(clientDecks[client][i].slideId === talent.slideId) {
          clientDecks[client][i].finalized = !talent["finalized"]
        }
        
        if(clientDecks[client][i].finalized) {
          finalizedSlides.push(clientDecks[client][i].slideId)
        }
      }
      
      this.updateFinalizedForClient(client, clientDecks, finalizedSlides)
      
      this.setState({
        clientDecks: clientDecks
      })
    }

    submitComment = (slideId) => {
      const payload = {
        content: this.state.commentContent,
        owner: properties.name,
        slide_id: slideId,
        client_id: this.state.client
      }

      const baseURL = window.location.href.split("#")[0]
      
      this.setState({
        disableSubmit: true
      })

      return axios.post(baseURL + "/slides/" + slideId + "/comments", payload)
      .then((res) => {
        this.setState({
          status: true,
          message: res.data.comment
        })
        setTimeout(() => {
          window.location.href = ""
        }, 2500)
      })
      .catch((err) => {
        this.setState({
          status: false,
          message: "Failed to submit comment!"
        })
        
        if(err.response.status === 403) {
          window.location.href = err.response.data.redirect_path
        }
      })
    }

    sendMessage = () => {
      const payload = {
        content: this.state.messageContent,
        sender: properties.name,
        receiver: this.state.clientList[this.state.client].name,
        event_id: window.location.href.split("/")[-1],
        client_id: this.state.client
      }

      const baseURL = window.location.href.split("#")[0]
      
      this.setState({
        disableSubmit: true
      })

      return axios.post(baseURL + "/messages", payload)
      .then((res) => {
        this.setState({
          status: true,
          message: res.data.message
        })
        setTimeout(() => {
          window.location.href = ""
        }, 2500)
      })
      .catch((err) => {
        this.setState({
          status: false,
          message: "Failed to send message!"
        })
        
        if(err.response.status === 403) {
          window.location.href = err.response.data.redirect_path
        }
      })
    }

    
    render() {
        let selectStyle = {
          backgroundColor: "#B5DDA4"
        }
      
        return(
            <div>
                <br />
                <FormControl variant="standard">
                    <p>Select a client below to view their slide deck</p>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      options={this.state.clientOptions}
                      value={this.state.client}
                      onChange={(option) => this.handleClientChange(option)}
                      label="Select Client"
                      autoWidth
                    >
                        {this.state.clientOptions}
                    </Select>
                </FormControl>
                
                <br /><br />
                
                {this.state.client !== "" &&
                    <div>
                        <div className="col-md-8 offset-md-2">
                        
                            <TableContainer>
                              <Table size="medium" sx={{ minWidth: 200, width: 250 }}>
                                <TableHead style={{ backgroundColor: "#3498DB" }}>
                                  <TableRow>
                                    <TableCell align="center">Preference</TableCell>
                                    <TableCell align="center">Talent Name</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {this.state.clientDecks[this.state.client]
                                      .map((row, i) => {
                                        return(
                                          <TableRow key={i} style={row.finalized ? selectStyle : {}}>
                                              <TableCell align="center">{row.preference}</TableCell>
                                              <TableCell align="center">{row.talentName}</TableCell>
                                              {!row.finalized &&
                                              <>
                                                <TableCell align="center">Not Finalized</TableCell>
                                                <TableCell>
                                                  <Button 
                                                    size="small" 
                                                    color="success" 
                                                    variant="contained" 
                                                    onClick={() => this.finalizeTalent(row)} 
                                                    disableElevation>Finalize</Button>
                                                </TableCell>
                                              </>
                                              }
                                              {row.finalized &&
                                              <>
                                                <TableCell align="center">Finalized</TableCell>
                                                <TableCell>
                                                  <Button 
                                                    size="small" 
                                                    color="error" 
                                                    variant="contained" 
                                                    onClick={() => this.finalizeTalent(row)} 
                                                    disableElevation>Remove</Button>
                                                </TableCell>
                                              </>
                                              }
                                          </TableRow>
                                        )
                                    })
                                  }
                                </TableBody>
                              </Table>
                            </TableContainer>
                            
                            {(this.state.status !== "" && this.state.status) && 
                                <div className="col-md-6 offset-md-3">
                                  <br />
                                  <Alert severity="success">{this.state.message}</Alert>
                                  <br />
                                </div>
                            }
                            
                            {(this.state.status !== "" && !this.state.status) &&
                                <div className="col-md-6 offset-md-3">
                                  <br />
                                  <Alert severity="error">Error: {this.state.message}</Alert>
                                  <br />
                                </div>
                            }

                            <br />
                            <Button variant="contained" onClick={this.expandSlides}>Expand Deck</Button><br /><br />

                            {this.state.expandSlides &&
                            <Paper>
                              <TableContainer>
                                <Table size="medium">
                                  <TableBody> {
                                    this.state.page === 0 ? (
                                    // Gray box for the first page
                                      <TableRow>
                                        <TableCell>
                                          <div
                                            style={{
                                              width: "100%",
                                              height: "700px",
                                              backgroundColor: '#727278',
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              position: "relative"
                                            }}
                                          >
                                            <Button style={{position: "absolute", bottom: 20}} variant="contained" onClick={this.openChatWindow}>Chat with {this.state.clientList[this.state.client].name}</Button><br/>
                                            {this.state.openChatWindow && 
                                                <div
                                                  style={{
                                                    width: "80%",
                                                    height: "300px",
                                                    borderRadius: "5px",
                                                    backgroundColor: 'white',
                                                    display: "flex",
                                                    position: "relative"
                                                  }}
                                                >
                                                  <List>
                                                    {this.state.clientMessages[this.state.client].map((message) =>(
                                                          <ListItem
                                                            key = {message.messageContent}
                                                          >
                                                          
                                                          {message.messageFrom === properties.name &&
                                                            <Box
                                                              sx={{
                                                                borderRadius: "20px",
                                                                color: "white",
                                                                padding: "10px",
                                                                marginRight: "auto",
                                                                backgroundColor: '#087FFF',
                                                                maxWidth: "60%",
                                                                position: "relative",
                                                                marginBottom: "10%"
                                                              }}
                                                            >
                                                              <ListItemText 
                                                                // style={{position: "absolute", left: 400}} 
                                                                primary={`${message.messageContent}`} 
                                                                secondary={new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                                                            </Box>
                                                          }
                                                          {message.messageFrom != properties.name &&
                                                            <Box
                                                              style={{
                                                                borderRadius: "20px",
                                                                marginLeft: "auto",
                                                                maxWidth: "60%",
                                                                position: "relative",
                                                                backgroundColor: '#d8d8d8',
                                                                display: "flex",
                                                              }}
                                                            >
                                                              <ListItemText 
                                                                // style={{position: "absolute", left: 20}} 
                                                                primary={`${message.messageContent}`}
                                                                secondary={new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                                                            </Box>
                                                          }

                                                          </ListItem>
                                                    ))}
                                                  </List>

                                                  <br />
                                                  <TextField id="title-textfield" name="messageContent" multiline minRows={1} maxRows={3} style={{position: "absolute", width: "75%", bottom: 0, left: 0}} onChange={this.handleChange} onBlur={this.handleBlur} onClick={this.handleClick} placeholder="Type message here..." />
                                                  <br />
                                                  <Button disabled={this.state.disableSubmit} variant="contained" style={{position: "absolute", bottom: 0, right: 0}} onClick={() => this.sendMessage()}>Send Message</Button><br />
                                                </div>
                                            } 
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      this.state.clientDecks[this.state.client]
                                        .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1)* this.state.rowsPerPage + this.state.rowsPerPage)
                                        .map((row) => {
                                          return(
                                            <TableRow
                                              key={row.slideId}
                                              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            >
  
                                              <TableCell>
                                                <Slide
                                                  disabled
                                                  schema={this.state.schema}
                                                  uiSchema={this.state.uiSchema}
                                                  formData={row.formData}
                                                  children={true}
                                                />

                                                <br />

                                                Comments:
                                                
                                                <br />     

                                                
                                                <List>
                                                  {this.state.clientComments[this.state.client][(this.state.page - 1)].map((comment) =>(
                                                    <ListItem
                                                      key = {comment.commentContent}
                                                    >
                                                    
                                                      <ListItemText primary={`${comment.commentContent}`} secondary={`${comment.commentOwner}`} />

                                                    </ListItem>

                                                  ))}
                                                </List>
                                                

                                                <br />   

                                                <TextField id="title-textfield" name="commentContent" onChange={this.handleChange} onBlur={this.handleBlur} onClick={this.handleClick} defaultValue="Enter Comment" />

                                                <br />

                                                <Button disabled={this.state.disableSubmit} variant="contained" onClick={() => this.submitComment(row.slideId)}>Submit Comment</Button><br />

                                              </TableCell>

                                              
                                            </TableRow>
                                          )
                                      })
                                    )}
                                  </TableBody>
                                  
                                  <TableFooter>
                                    <TableRow>
                                      <TablePagination
                                        rowsPerPageOptions={[1]}
                                        count={this.state.clientDecks[this.state.client].length + 1}
                                        rowsPerPage={this.state.rowsPerPage}
                                        page={this.state.page}
                                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                                        onPageChange={this.handleChangePage}
                                      />
                                    </TableRow>
                                  </TableFooter>
                                  
                                </Table>
                              </TableContainer>
                            </Paper>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default AdminClientDecks