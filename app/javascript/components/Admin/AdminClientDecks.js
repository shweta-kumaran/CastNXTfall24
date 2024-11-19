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
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import Slide from "../Forms/Slide";
import AdminUserTable from "./AdminUserTable";
import AdminCreateStack from "./AdminCreateStack";
class AdminClientDecks extends Component {
    constructor(props) {
        super(props)
        console.log("PROPS: ", this.props.properties)
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
            announcements: props.properties.data.announcements,
            announcementContent: "",

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

        console.log("State Slide: ", this.state.slides)
        for(var key in clients) {
          if(clients[key].slideIds.length > 0) { // client has selected talents
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
        console.log("Client Decks: ", clientDecks)
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
      console.log("Talent in finalizeTalent: ", talent)
      let client = this.state.client
      let clientDecks = this.state.clientDecks
      let finalizedSlides = []
      console.log("Client Decks length: ", clientDecks[client].length)
      for(var i=0; i<clientDecks[client].length; i++) {
        console.log("In for loop", clientDecks[client][i].slideId)
        console.log("talent slide ID", talent.slideId)
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
        user_id: this.state.client
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

    sendAnnouncement = () => {
      const payload = {
        content: this.state.announcementContent,
        sender: "Producer",
        for_client: true,
        event_id: window.location.href.split("/")[-1],
      }

      const baseURL = window.location.href.split("#")[0]
      
      this.setState({
        disableSubmit: true
      })

      return axios.post(baseURL + "/announcements", payload)
      .then((res) => {
        this.setState({
          status: true,
          message: res.data.announcement
        })
        setTimeout(() => {
          window.location.href = ""
        }, 2500)
      })
      .catch((err) => {
        this.setState({
          status: false,
          message: "Failed to send announcement!"
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
                      <Button variant="contained" onClick={this.expandSlides}>Expand Deck</Button><br /><br />
                      <AdminUserTable heading="Talents" properties={this.props.properties} currentTab="Client Decks" showCheckbox={false} currentClient={this.state.client} currentTalents={this.state.clientDecks} finalizeTalent={this.finalizeTalent}/>

                        <div className="col-md-8 offset-md-2">

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
                                              height: "1000px",
                                              backgroundColor: '#727278',
                                              display: "flex",
                                              flexDirection: 'column',
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                              position: "relative"
                                            }}
                                          >                                     
                                            <div
                                              style={{
                                                width: '100%',
                                                height: "100px",
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#075E54',
                                                color: 'white',
                                                fontSize: '24px',
                                                left: 10 
                                              }}
                                            >
                                              Announcements
                                            </div>   
                                                
                                            <div
                                            style={{
                                              width: "100%",
                                              height: "calc(50% - 100px)",
                                              borderRadius: "5px",
                                              backgroundColor: '#d3d3d3',
                                            }}
                                            >

                                              <List
                                                style={{
                                                  flex: 1, // Takes all available vertical space above the input area
                                                  overflowY: "auto", // Enables scrolling for messages
                                                  height: "342px"
                                                }}
                                              >
                                                {this.state.announcements.filter((announcement) => {
                                                  const is_for_client = announcement.forClient == true;

                                                  return is_for_client;
                                                }).map((announcement) =>(
                                                  <ListItem
                                                    key = {announcement.announcementContent}
                                                  >
                                                  
                                                  
                                                  <Box
                                                  sx={{
                                                    marginBottom: "10px",
                                                    width: '100%'
                                                  }}
                                                  >
                                                    
                                                    <Box
                                                      sx={{
                                                        backgroundColor: "white", 
                                                        color: "black",
                                                        padding: "10px",
                                                        borderRadius: "10px",
                                                        wordWrap: "break-word",
                                                        whiteSpace: "pre-wrap",
                                                        marginRight: "auto",           
                                                        position: "relative",
                                                      }}
                                                    >
                                                      <ListItemText 
                                                        primary={announcement.announcementContent} secondary={new Date(announcement.timeSent).toLocaleDateString([], {year: 'numeric', month: 'long', day: 'numeric'})}
                                                      />
                                                    </Box>
                                                    
                                                  </Box>

                                                  
                                                  </ListItem>
                                                ))}
                                              </List>

                                              <br />
                                              <TextField id="title-textfield" name="announcementContent" multiline minRows={1} maxRows={3} style={{backgroundColor: "white", position: "absolute", width: "75%", bottom: 500, left: 0}} onChange={this.handleChange} onClick={this.handleClick} placeholder="Make announcement here..." />
                                              <br />
                                              <Button disabled={this.state.disableSubmit} variant="contained" style={{position: "absolute", bottom: 500, right: 0}} onClick={() => this.sendAnnouncement()}>Send Announcement</Button><br />
                                              
                                            </div>

                                            <div
                                              style={{
                                                width: "100%",
                                                height: "50%",  // Occupies the bottom half of the gray box
                                                display: "flex",
                                                justifyContent: "center", // Adjusts the chat window horizontally
                                                alignItems: "start",
                                                position: "relative",
                                              }}
                                            >

                                              <Button style={{position: "absolute", bottom: 20}} variant="contained" onClick={this.openChatWindow}>Chat with {this.state.clientList[this.state.client].name}</Button><br/>

                                              {this.state.openChatWindow && 
                                                  <div
                                                    style={{
                                                      width: "80%",
                                                      height: "425px",
                                                      borderRadius: "5px",
                                                      backgroundColor: 'white',
                                                      display: "flex",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <List
                                                      style={{
                                                        flex: 1, // Takes all available vertical space above the input area
                                                        overflowY: "auto", // Enables scrolling for messages
                                                        height: "368px"
                                                      }}
                                                    >
                                                      {this.state.clientMessages[this.state.client].map((message) =>(
                                                            <ListItem
                                                              key = {message.messageContent}
                                                            >
                                                            

                                                            {message.messageFrom === properties.name &&
                                                              <Box
                                                              sx={{
                                                                display: "flex",              // Align the message and timestamp together
                                                                flexDirection: "column",      // Stack bubble and timestamp vertically
                                                                alignItems: "flex-start",       
                                                                marginBottom: "10px",
                                                                width: '100%'
                                                              }}
                                                              >
                                                                {/* Timestamp outside and below the bubble */}
                                                                <Typography 
                                                                  variant="caption"               // Smaller font size for the timestamp
                                                                  sx={{
                                                                    marginTop: "4px",
                                                                    color: "gray",                 // Lighter color for the timestamp
                                                                  }}
                                                                >
                                                                  {`You     ${new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                                </Typography>
                                                                <Box
                                                                  sx={{
                                                                    backgroundColor: "#007aff",    // Blue bubble for the current user's messages
                                                                    color: "white",
                                                                    padding: "10px",
                                                                    borderRadius: "20px",
                                                                    maxWidth: "60%",
                                                                    wordWrap: "break-word",
                                                                    whiteSpace: "pre-wrap",
                                                                    marginRight: "auto",            // Align the bubble to the left
                                                                    position: "relative",
                                                                  }}
                                                                >
                                                                  <ListItemText 
                                                                    primary={message.messageContent}
                                                                  />
                                                                </Box>
                                                                
                                                              </Box>

                                                            }
                                                            {message.messageFrom != properties.name &&
                                                              <Box
                                                              sx={{
                                                                display: "flex",
                                                                flexDirection: "column",        // Stack bubble and timestamp vertically
                                                                alignItems: "flex-start",       // Align to the left
                                                                marginBottom: "10px",
                                                                width: '100%'
                                                              }}
                                                              >

                                                                {/* Timestamp outside and below the bubble */}
                                                                <Typography 
                                                                  variant="caption"               // Smaller font size for the timestamp
                                                                  sx={{
                                                                    marginTop: "4px",
                                                                    color: "gray",                 // Lighter color for the timestamp
                                                                  }}
                                                                >
                                                                  {`${this.state.clientList[this.state.client].name}     ${new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                                </Typography>
                                                                <Box
                                                                  sx={{
                                                                    backgroundColor: "#e5e5ea",    // Gray bubble for other users
                                                                    color: "black",
                                                                    padding: "10px",
                                                                    borderRadius: "20px",
                                                                    maxWidth: "60%",
                                                                    wordWrap: "break-word",
                                                                    whiteSpace: "pre-wrap",
                                                                    marginRight: "auto",           // Align the bubble to the left
                                                                    position: "relative",
                                                                  }}
                                                                >
                                                                <ListItemText 
                                                                  primary={message.messageContent} 
                                                                />
                                                                </Box>
                                                                
                                                              </Box>
                                                            }

                                                            </ListItem>
                                                      ))}
                                                    </List>

                                                    <br />
                                                    <TextField id="title-textfield" name="messageContent" multiline minRows={1} maxRows={3} style={{position: "absolute", width: "77%", bottom: 0, left: 0}} onChange={this.handleChange} onClick={this.handleClick} placeholder="Type message here..." />
                                                    <br />
                                                    <Button disabled={this.state.disableSubmit} variant="contained" style={{position: "absolute", bottom: 0, right: 0}} onClick={() => this.sendMessage()}>Send Message</Button><br />
                                                  </div>
                                              } 
                                            </div>
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