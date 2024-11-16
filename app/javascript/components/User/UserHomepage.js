import React, { Component} from "react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MuiAlert from '@mui/material/Alert';
import CategoryFilter from "../Filter/CategoryFilter";
import Button from "@mui/material/Button";
import LocationFilter from "../Filter/LocationFilter";
import IsPaidFilter from "../Filter/IsPaidFilter";
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from "../Navbar/Header";
import FormControl from "@mui/material/FormControl";
import DatePickerWrapperStart from "../Shared/DatePickerStart";
import DatePickerWrapperEnd from "../Shared/DatePickerEnd";
import axios from "axios";
const commonStyle = {marginTop: "20px", marginBottom: "20px"}

class UserHomepage extends Component {
    constructor(props) {
        super(props)
        console.log("Props received in constructor:", props);

        //const submittedTableData = properties.submittedTableData || []
        const { acceptingTableData = [], submittedTableData = [], events_near_user = [], user_state = '', user_city = '' } = props;
        const eventDeletedFlag = submittedTableData.find((event)=>{
            if(event.status === 'DELETED'){
                let currTime = new Date();
                let updatedTime = new Date(event.delete_time);
                return (currTime.getTime() - updatedTime.getTime())/(1000 * 3600 * 24) <7;
            }
        }) 

        var savedTabValue = localStorage.getItem('savedTabValue');
        console.log(savedTabValue);
        if (savedTabValue===null){
            
            savedTabValue = 0
        }else{
            savedTabValue = parseInt(savedTabValue,10);
        }
        this.state = {
            acceptingTableData: properties.acceptingTableData ? properties.acceptingTableData : [],
            submittedTableData: properties.submittedTableData ? properties.submittedTableData : [],
            eventsNearUser: properties.events_near_user || [],
            eventDeletedFlag,
            tabValue: savedTabValue,
            categoryFilterTextValue: 'All', 
            stateName: user_state, 
            cityName: user_city, 
            title:'',
            eventdateStart:'',
            eventdateEnd:'',
            filteredTableData: savedTabValue===0 ? (properties.acceptingTableData ? properties.acceptingTableData : []):(properties.submittedTableData ? properties.submittedTableData : []),
            isPaidFilterValue: 'None',
            openInbox: false,
            openChatWindow: false,
            openAnnouncementWindow: false,
            disableSubmit: false,
            messageContent: '',
            eventToMessage: null,
            messageGroups: null,
            selectedGroupMessages: [],
        }
    }
    
    handleTabChange = (event, value) => {
        localStorage.setItem('savedTabValue', value);
        
        this.setState({
            tabValue: value,

            filteredTableData: value===0 ? this.state.acceptingTableData:this.state.submittedTableData,
            openChatWindow: false,
        })
        location.reload();
    }
    
    handleLocationFilterChange = (stateName, cityName) =>{
        this.setState({
            stateName,
            cityName
        })
    }
    onReset =()=>{
        location.reload();
    }
    handleTitleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        this.setState({
            [e.target.name]: sanitizedValue
        })
    }
    handleDateChange = (e) => {
        const { name, value } = e.target;
        // Validate date range if both eventdateStart and eventdateEnd are present
        if (name === 'eventdateStart') {
            this.setState({ eventdateStart: value }, () => {
                this.validateDateRange(this.state.eventdateStart, this.state.eventdateEnd);
            });
        } else if (name === 'eventdateEnd') {
            this.setState({ eventdateEnd: value }, () => {
                this.validateDateRange(this.state.eventdateStart, this.state.eventdateEnd);
            });
        }
    }

    validateDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        console.log(startDate);
        console.log(endDate);
        if (startDate > endDate) {
            // Set a warning message in the state
            this.setState({
                dateRangeWarning: "Event end date must be greater than start date",
            });
        } else {
            // Clear the warning message and set the end date
            this.setState({
                dateRangeWarning: ""
            });
        }
    };

    groupEventMessages = (messages) => {
        const grouped = {};
      
        messages.forEach((message) => {
          const recipientKey = message.messageTo.sort().join(","); // Generate a unique key for each group
          if (!grouped[recipientKey]) {
            grouped[recipientKey] = {
              talentNames: message.messageTo, // Array of recipient names
              messages: [],
            };
          }
          grouped[recipientKey].messages.push(message);
        });
      
        return Object.values(grouped); // Convert to an array of group objects
      }

    selectMessageGroup = (group) => {
        this.setState({
            openChatWindow: true,
            openInbox: false,
            selectedGroupMessages: group.messages
        })
      }

    openMessageInbox = () => {
        const groupedMessages = this.groupEventMessages(this.state.eventToMessage.messages).sort((group1Messages, group2Messages) => {
            // Access the `timeSent` of the last message in each group

            const group1LastMessageTime = new Date(group1Messages.messages.slice(-1)[0].timeSent);
            const group2LastMessageTime = new Date(group2Messages.messages.slice(-1)[0].timeSent);

        
            // Sort in descending order (most recent first)
            return group2LastMessageTime - group1LastMessageTime;
          })
        this.setState({
          openInbox: !this.state.openInbox,
          openChatWindow: false,
          messageGroups: groupedMessages,
        })
      }

    openChatWindow = () => {
        this.setState({
          openChatWindow: !this.state.openChatWindow
        })
      }

    openAnnouncement = () => {
        this.setState({
            openAnnouncementWindow: !this.state.openAnnouncementWindow,
            openInbox: false,
            openChatWindow: false,
        })
    }
  
      handleChange = (e, value) => {
        this.setState({
            [e.target.name]: e.target.value
        })
      }
  
      sendMessage = () => {

        let messageTo = this.state.selectedGroupMessages.length > 0 ? this.state.selectedGroupMessages[0].messageTo : []; 
        let userIds = this.state.selectedGroupMessages.length > 0 ? this.state.selectedGroupMessages[0].userIds : [];


        const payload = {
          content: this.state.messageContent,
          sender: properties.name,
          receiver: messageTo,
          event_id: this.state.eventToMessage.id,
          user_id: userIds,
        }
        const baseURL = window.location.href.split("#")[0]
        
        this.setState({
          disableSubmit: true
        })
  
        return axios.post(baseURL + "/events/" + this.state.eventToMessage.id + "/messages", payload)
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
    

    onSubmit = () => {  
        
        let tableDataCopy = this.state.tabValue===0 ? this.state.acceptingTableData:this.state.submittedTableData;
        console.log("table data", tableDataCopy)
        // Category Based Filtering
        let categoryFilterValues = tableDataCopy.filter((event) => this.state.categoryFilterTextValue === 'All' ? true: this.state.categoryFilterTextValue === event.category)
        console.log("Category filter: ", categoryFilterValues)
        let finalFilterValues = categoryFilterValues
        let stateFilterValues = null
        let cityFilterValues = null
        let titleFilterValues = null
        
        // State Based Filtering
        if(this.state.stateName) {
            stateFilterValues = categoryFilterValues.filter((event) => {
                return event.statename === this.state.stateName
            })
            finalFilterValues = stateFilterValues
        }else{
            stateFilterValues = categoryFilterValues;
        }
        
        // City Based Filtering
        if(this.state.cityName) {
            cityFilterValues = stateFilterValues.filter((event) => {
                return event.location === this.state.cityName
            })
            finalFilterValues = cityFilterValues
        } else {
            if(stateFilterValues) {
                finalFilterValues = stateFilterValues
            } else {
                finalFilterValues = categoryFilterValues
            }
        }

        // title Based Filtering
        if(this.state.title) {
            finalFilterValues = finalFilterValues.filter((event) => {
                    return event.title.includes(this.state.title)
                })
            }
        if (this.state.eventdateStart) {
            const startDate = new Date(this.state.eventdateStart);
            finalFilterValues = finalFilterValues.filter((event) => {
                const eventDate = new Date(event.date);
                return eventDate.getTime() >= startDate.getTime();
            });
        }
        if (this.state.eventdateEnd) {
            const endDate = new Date(this.state.eventdateEnd);
            finalFilterValues = finalFilterValues.filter((event) => {
                const eventDate = new Date(event.date);
                return eventDate.getTime() <= endDate.getTime();
            });
        }
        // IsPaid Based Filtering
        finalFilterValues = finalFilterValues.filter((event) => this.state.isPaidFilterValue === 'None' ? true: this.state.isPaidFilterValue === event.ispaid)
        
        this.setState({
            filteredTableData: finalFilterValues
        })
    }

    
    onCategoryFilterValueSelected = (categoryFilterValue) =>{
        this.setState({
            categoryFilterTextValue: categoryFilterValue
        })
    }
    
    onIsPaidFilterSelected = (isPaidValue) =>{
        this.setState({
            isPaidFilterValue: isPaidValue
        })
    }
    
    renderAcceptingEventList() {
        const { acceptingTableData, filteredTableData } = this.state
        
        let rows = []
        if (!filteredTableData.length) {
            rows.push(
                 <TableRow key={0}>
                    <TableCell align="center">
                        No ongoing Events right now.
                    </TableCell>
                 </TableRow>
            )
        } else {
            filteredTableData.map((event, i) => {
                // check if the event date is in the past
                const isPastEvent = new Date(event.date) < new Date();
                // add a CSS class to the table row to disable it if the event is in the past
                const rowClass = isPastEvent ? "disabled-row" : "";
                rows.push(
                    <TableRow key={i} className={rowClass} onClick={() => {window.location.href="/user/events/"+event.id}}>
                        <TableCell align="center" >
                            <b><a href={"/user/events/" + event.id}>{event.title}</a></b>
                        </TableCell>
                        <TableCell align="center" >
                            <b>{event.category}</b>
                        </TableCell>
                        <TableCell align="center" >
                            <b>{new Date(event.date).toLocaleDateString()}</b>
                        </TableCell>
                        <TableCell align="center" >
                            <b>{event.location + ", " + event.statename}</b>
                        </TableCell>
                        <TableCell align="center" >
                            <b>{event.ispaid}</b>
                        </TableCell>
                    </TableRow>
                )
            });
        } 
        return rows;
    }
    
    renderSubmittedEventList(type) {
        const { submittedTableData, filteredTableData } = this.state
        
        let rows = []
        if (!filteredTableData.length) {
            rows.push(
                 <TableRow key={0}>
                    <TableCell colSpan={3} align="center">
                        No Events submitted to right now.
                    </TableCell>
                 </TableRow>
            )
        } else {
            filteredTableData.map((event, i) => {
                if (event.accepting) {
                    rows.push(
                        <TableRow key={i}>
                            <TableCell align="center" onClick={() => {window.location.href="/user/events/"+event.id}}>
                                <b><a href={"/user/events/" + event.id}>{event.title}</a></b>
                            </TableCell>
                            <TableCell align="center">
                                {event.status}
                            </TableCell>
                            <TableCell align="center">
                                <Button variant="contained" onClick={() => {this.setState({ eventToMessage: event }, () => {this.openMessageInbox();});}}>Open Event Inbox</Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button variant="contained" onClick={() => {this.setState({ eventToMessage: event }, () => {this.openAnnouncement();});}}>Open Event Announcements</Button>
                            </TableCell>
                        </TableRow>
                    )
                } else {
                    rows.push(
                        <TableRow key={i}>
                            <TableCell align="center">
                                <b>{event.title}</b>
                            </TableCell>
                            <TableCell align="center">
                                {event.status}
                            </TableCell>
                            <TableCell align="center">
                                <Button variant="contained" onClick={() => {this.setState({ eventToMessage: event }, () => {this.openMessageInbox();});}}>Open Event Inbox</Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button variant="contained" onClick={() => {this.setState({ eventToMessage: event }, () => {this.openAnnouncement();});}}>Open Event Announcements</Button>
                            </TableCell>
                        </TableRow>
                    )
                }
            });
        } 
        return rows;
    }

    renderEventBoxes() {
        const { eventsNearUser } = this.state;
    
        if (!eventsNearUser || eventsNearUser.length === 0) {
            return <Typography>No nearby events available</Typography>;
        }
    
        const isScrollable = eventsNearUser.length <= 3;
    
        return (
            <div
                style={{
                    display: "flex",
                    overflowX: isScrollable ? "auto" : "scroll",
                    padding: "10px",
                    justifyContent: isScrollable ? "center" : "flex-start",
                    whiteSpace: isScrollable ? "normal" : "nowrap",
                }}
            >
                {eventsNearUser.map((event, index) => (
                    <Box
                        key={index}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "10px",
                            marginRight: "10px",
                            cursor: "pointer",
                            width: "200px",
                            minHeight: "150px",
                            display: "inline-block",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            backgroundColor: "#f9f9f9",
                        }}
                        onClick={() => window.location.href = `/user/events/${event.id}`}
                    >
                        <Typography variant="h6" gutterBottom>
                            {event.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {event.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {event.location}, {event.statename}
                        </Typography>
                        <Typography variant="body2" color={event.ispaid ? "green" : "red"}>
                            {event.ispaid ? "Paid" : "Free"}
                        </Typography>
                    </Box>
                ))}
            </div>
        );
    }    

    render() {
        const { eventsNearUser = [] } = this.state;
        return(
            <div>
                <div>
                    <Header />
                </div>
                <div>
                    <div className="container user-events">
                        {
                            this.state.eventDeletedFlag ? <MuiAlert onClick={() => (this.setState({eventDeletedFlag: false}))} severity="warning" elevation={6} variant="filled">Note: Certain events have been cancelled. Please check submissions for more details. Sorry for the inconvenience.</MuiAlert> : null
                        }
                
                        <div className="row">
                            <h2> CastNXT Events</h2>
                        </div>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <div>
                                    <Tabs variant="fullWidth" value={this.state.tabValue} onChange={this.handleTabChange} centered>
                                        <Tab style={{focus: "color: #719ECE"}} label="Events" />
                                        <Tab label="Submissions" />
                                    </Tabs>
                                    <hr style={{ color: "black" }} />
                                </div>
                                {this.state.tabValue === 0 &&
                                    (<div className="row">
                                    <h4>Events Near Me</h4>
                                    {this.renderEventBoxes()}
                                </div>)}
                                
                                <div><b>Category Filter</b></div>
                                <CategoryFilter categoryFilterValueSelected = {this.onCategoryFilterValueSelected}></CategoryFilter>
                                <FormControl fullWidth>
                                <DatePickerWrapperStart id='eventdateStart' name='eventdateStart' variant='outlined' value={this.state.eventdateStart} style={commonStyle} onChange={this.handleDateChange} />
                                <DatePickerWrapperEnd id='eventdateEnd' name='eventdateEnd' variant='outlined' value={this.state.eventdateEnd} style={commonStyle} onChange={this.handleDateChange} />
                                </FormControl>
                                <FormControl fullWidth>
                                <TextField  id="title-textfield" name="title" label="Event title" variant="outlined" value={this.state.title} onChange={this.handleTitleChange}/>
                                </FormControl>
                                <LocationFilter handleLocationFilterChange = {this.handleLocationFilterChange}></LocationFilter>
                                <div><b>Is the event paid ?</b></div>
                                <IsPaidFilter isPaidFilterSelected = {this.onIsPaidFilterSelected}></IsPaidFilter>
                                <Button variant="outlined" onClick = {this.onReset} style={commonStyle}>Reset Filter</Button> 
                                <Button variant="outlined" onClick = {this.onSubmit} style={commonStyle}>Submit Filter</Button> 
                                
                                {this.state.dateRangeWarning && (
                                    <div style={{ color: 'red', marginTop: '10px' }}>
                                        {this.state.dateRangeWarning}
                                    </div>
                                )}
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table" id="events">
                                            <TableHead style={{ backgroundColor: "#3498DB" }}>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Event</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Category</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Date</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Location</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Is Paid?</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.renderAcceptingEventList()}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                
                                {this.state.tabValue === 1 &&
                                    <div>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead style={{ backgroundColor: "#3498DB" }}>
                                                <TableRow>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Event</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Status</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Inbox</TableCell>
                                                    <TableCell align="center" style={{fontSize: "12pt"}}>Announcements</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.renderSubmittedEventList()}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div>
                                    {this.state.openInbox &&
                                        <div
                                            style={{
                                            width: "540px",
                                            height: "550px",
                                            backgroundColor: '#727278',
                                            display: "flex",
                                            flexDirection: 'column',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "relative",
                                            }}
                                        >
                                            <div
                                                style={{
                                                width: "90%",
                                                height: "450px",
                                                borderRadius: "5px",
                                                backgroundColor: 'white',
                                                display: "flex",
                                                position: "relative",
                                                }}
                                            >

                                                <List
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    overflowY: "auto",
                                                }}
                                                >
                                                {this.state.messageGroups.map((group, index) => {
                                                    const lastMessage = group.messages.slice(-1)[0]; // Get the last message in the group
                                                    const messageFrom = lastMessage.messageFrom;
                                                    const messagePreview = lastMessage.messageContent.slice(0,35);
                                                    const timeSent = new Date(lastMessage.timeSent); 
                                                    const formattedTime = timeSent.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                    return (<React.Fragment key={index}>
                                                        <ListItem
                                                        button
                                                        onClick={() => this.selectMessageGroup(group)}
                                                        >
                                                        <ListItemText   
                                                            primary={`${["Producer", ...group.talentNames].join(', ')}`} 
                                                            secondary={`${messageFrom}: ${messagePreview}`} />
                                                            <span style={{ marginLeft: 'auto', color: 'gray' }}>
                                                                {formattedTime}
                                                            </span>
                                                        </ListItem>
                                                        
                                                        {index < this.state.messageGroups.length - 1 && <Divider />} 
                                                    </React.Fragment>);
                                                    })}
                                                </List>
                                            </div>
                                        </div>
                                        
                                    }
                                    {this.state.openChatWindow && 
                                        <div
                                        style={{
                                            width: "540px",
                                            height: "550px",
                                            backgroundColor: '#727278',
                                            display: "flex",
                                            flexDirection: 'column',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "relative",
                                        }}
                                        >  
                                        <div
                                            style={{
                                            width: "90%",
                                            height: "450px",
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
                                            {this.state.selectedGroupMessages.map((message) =>(
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
                                                        {`${message.messageFrom}     ${new Date(message.timeSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
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
                                            <TextField id="title-textfield" name="messageContent" multiline minRows={1} maxRows={3} style={{position: "absolute", width: "69%", bottom: 0, left: 0}} onChange={this.handleChange} onClick={this.handleClick} placeholder="Type message here..." />
                                            <br />
                                            <Button disabled={this.state.disableSubmit} variant="contained" style={{position: "absolute", bottom: 0, right: 0}} onClick={() => this.sendMessage()}>Send Message</Button><br />
                                        </div>
                                        </div>
                                    }
                                    {this.state.openAnnouncementWindow && 
                                        
                                        <div
                                            style={{
                                                width: "540px",
                                                height: "550px",
                                                backgroundColor: '#727278',
                                                display: "flex",
                                                flexDirection: 'column',
                                                justifyContent: "center",
                                                alignItems: "center",
                                                position: "relative",
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
                                                height: "calc(100% - 100px)",
                                                borderRadius: "5px",
                                                backgroundColor: '#d3d3d3',
                                                overflowY: "auto"
                                            }}
                                            >
                                                <List>
                                                    {this.state.eventToMessage.announcements.map((announcement) =>(
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
                                        </div>
                                    }
                                    </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserHomepage