import React, {Component} from "react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Slide from "../Forms/Slide";


class ClientEventFeedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            schema: props.properties.data.schema,
            uischema: props.properties.data.uischema,
            slides: props.properties.data.slides,
            entries: [],
            page:0,
            rowsPerPage: 1,
            openChatWindow: false,
            feedback: "",
            clientComments: [],
            commentContent: "",
            clientMessages: props.properties.data.messages,
            messageContent: "",
            announcements: props.properties.data.announcements,
            clientId: props.properties.data.clientId,
            disableSubmit: false
        }
    }
    
    componentDidMount() {
      let slides = this.state.slides
      let entries = []
      let clientComments = []
      let slideComments = []
      console.log("properties: ", this.props.properties)
      for(var key in slides) {
        entries.push({
          ...slides[key],
          id: key,
        }) 

        if (slides[key].comments) {
          // TypeError: Cannot read properties of undefined (reading 'length')
          slideComments = []
          for(var j = 0; j < slides[key].comments.length; j++){
            slideComments.push(this.state.slides[key].comments[j])
          }
          clientComments.push(slideComments)
        }
      }
      this.setState({
          entries: entries,
          clientComments: clientComments
      })
    }
    
    handleChangePage = (event, newPage) => {
      this.setState({
        page: newPage
      })
    };
    
    handleChangeRowsPerPage = (event) => {
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

    openChatWindow = () => {
      this.setState({
        openChatWindow: !this.state.openChatWindow
      })
    }

    submitComment = (slideId) => {
      const payload = {
        content: this.state.commentContent,
        owner: this.props.properties.name,
        slide_id: slideId,
        client_id: this.state.clientId
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
        receiver: 'Producer',
        sender: this.props.properties.name,
        event_id: window.location.href.split("/")[-1],
        client_id: this.state.clientId
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

    generatePDF = () => {

      const report = new JsPDF('landscape','px','a4');
      // report.html(document.querySelector('report')).then(() => {
      //     report.save('report.pdf');
      // },
      // html2canvas: {scale:0.1}
      // )

      report.html(document.querySelector('report'), {
        callback: function (report) {
          report.save();
        },      
        html2canvas:{scale:0.5}
      });
    }
    
    render() {
        return(
          <report>
            <div>
                <div style={{marginTop: "1%"}}>

                    <div className="col-md-8 offset-md-2">
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
                                              overflowY: "auto"
                                            }}
                                            >
                                              <List>
                                                {this.state.announcements.map((announcement) =>(
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

                                            <Button style={{position: "absolute", bottom: 20}} variant="contained" onClick={this.openChatWindow}>Chat with Producer</Button><br/>
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
                                                      height: "368px",
                                                      flex: 1, // Takes all available vertical space above the input area
                                                      overflowY: "auto", // Enables scrolling for messages
                                                    }}
                                                  >
                                                    {this.state.clientMessages.map((message) =>(
                                                          <ListItem
                                                            key = {message.messageContent}
                                                          >
                                                          
                                                          {message.messageFrom === this.props.properties.name &&
                                                            <Box
                                                            sx={{
                                                              display: "flex",              // Align the message and timestamp together
                                                              flexDirection: "column",      // Stack bubble and timestamp vertically
                                                              alignItems: "flex-start",       // Align to the right
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
                                                                  marginRight: "auto",            // Align the bubble to the right
                                                                  position: "relative",
                                                                }}
                                                              >
                                                                <ListItemText 
                                                                  primary={message.messageContent}
                                                                />
                                                              </Box>
                                                              
                                                            </Box>
                                                          }
                                                          {message.messageFrom != this.props.properties.name  &&
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
                                                                {`Producer     ${new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
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
                                                  <TextField id="title-textfield" name="messageContent" multiline minRows={1} maxRows={3} style={{position: "absolute", width: "75%", bottom: 0, left: 0}} onChange={this.handleChange} onClick={this.handleClick} placeholder="Type message here..." />

                                                  <br />
                                                  <Button disabled={this.state.disableSubmit} variant="contained" style={{position: "absolute", bottom: 0, right: 0}} onClick={() => this.sendMessage()}>Send Message</Button><br />
                                                </div>
                                            } 
                                            </div>

                                          </div>
                                        </TableCell>
                                      </TableRow>
                              ) : (
                              this.state.entries
                                  .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1) * this.state.rowsPerPage + this.state.rowsPerPage)
                                  .map((row, index) => {
                                    return(
                                      <TableRow
                                        key={row.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                      >

                                        <TableCell>
                                          <Slide
                                            schema={this.state.schema}
                                            uiSchema={this.state.uischema}
                                            formData={row.formData}
                                            children={true}
                                            disabled
                                          />
                                          
                                          <br />
                                          
                                          Comments:
                                          
                                          <br />

                                          <List>
                                            {(this.state.clientComments[(this.state.page - 1)] || []).map((comment) =>(
                                              <ListItem
                                                key = {comment.commentContent}
                                              >
                                              
                                                <ListItemText primary={`${comment.commentContent}`} secondary={`${comment.commentOwner}`} />

                                              </ListItem>

                                            ))}
                                          </List>

                                          <br />   

                                          

                                          <TextField id="title-textfield" name="commentContent" onClick={this.handleClick} onBlur={this.handleBlur} onChange={this.handleChange} defaultValue="Enter Comment" />

                                          <br />

                                          <Button disabled={this.state.disableSubmit} variant="contained" onClick={() => this.submitComment(row.id)}>Submit Comment</Button><br />
                                          
                                          <br />

                                          <Button onClick={() => this.generatePDF()}>Export PDF</Button>

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
                                  count={this.state.entries.length + 1}
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
                    </div>
                    
                    <br />

                </div>
                
            </div>
          </report>
        )
    }
}

export default ClientEventFeedback