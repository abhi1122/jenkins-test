import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import useSound from "use-sound";
import boopSfx from "../sound/sound.mp3";
import Chip from "@material-ui/core/Chip";
import LiveHelp from "@material-ui/icons/HelpOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { get } from "../helper/service";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    // height: "90vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
  headerMessage: {
    padding: "16px 15px",
    borderBottom: "1px solid lightgray",
    textAlign: "left",
    boxShadow: "2px 1px 5px #aaa",
    fontSize: "20px",
    fontWeight: "initial",
    letterSpacing: "1px",
  },
  textDiv: {
    border: "1px solid lightgray",
    padding: "10px",
    width: "350px",
    borderRadius: "10px",
  },
  inputBox: {
    width: "100%",
    height: "100%",
    border: "0px",
    background: " #f1f0f0",
    padding: "0px 5px 5px 5px",
    outline: "none",
    fontSize: "15px",
  },
  logoutClass: {
    float: "right",
    paddingTop: "5px",
    fontSize: "30px",
    color: "rgb(220, 0, 78)",
  },
});

const CustomerChat = ({ socket }) => {
  const location = useLocation();
  const history = useHistory();
  const [QA, setQa] = useState([]);
  const [support, setSupport] = useState({ name: "Waiting..." });
  const [userNameState, setUserName] = useState(null);
  const [lastMessageTime, setlastMessageTime] = useState(new Date());
  const [chatList, setChat] = useState([]);
  const [chatText, setChatText] = useState("");
  const [play] = useSound(boopSfx, { volume: 0.25 });
  const [blockUi, setBlockUi] = useState(false);
  const [isSupportAvailable, setIsSupportAvailable] = useState(false);
  const buttonRef = useRef();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    console.log("calll scrollToBottom");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  const getState = () => {
    let newSupport;
    let newUserNameState;
    let newLastMessageTime;

    setSupport((old) => {
      newSupport = old;
      return old;
    });
    setUserName((old) => {
      newUserNameState = old;
      return old;
    });
    setlastMessageTime((old) => {
      newLastMessageTime = old;
      return old;
    });
    return { newSupport, newUserNameState, newLastMessageTime };
  };

  const autoLogout = () => {
    const { newSupport, newUserNameState, newLastMessageTime } = getState();
    console.log("setInterval call...", newLastMessageTime);
    const startTime = newLastMessageTime;
    const endTime = new Date();
    const difference = endTime.getTime() - startTime.getTime();
    const resultInMinutes = Math.round(difference / 60000);
    console.log(resultInMinutes, "..resultInMinutes");
    if (resultInMinutes > 5) {
      console.log(
        support,
        userNameState,
        "...autoLogout",
        newSupport,
        newUserNameState,
        socket.id
      );
      socket.emit("sentMessageLogoutToRoom", {
        sendTo: newSupport.id,
        name: newUserNameState,
        id: socket.id,
      });
      history.push({
        pathname: "/customer",
      });
    }
  };

  useEffect(() => {
    const { userName = null } = location.state;
    console.log("user effect call....");
    if (!userName) {
      console.log("enter if....", userName);
      const {
        socketId,
        id,
        userName: customerName,
      } = JSON.parse(localStorage.getItem("customer"));
      console.log("logout call....", socketId, id, customerName);
      socket.emit("sentMessageLogoutToRoom", {
        sendTo: id,
        name: customerName,
        id: socketId,
      });
      history.push({
        pathname: "/customer",
      });
    }

    window.history.replaceState({ state: {} }, document.title);

    setUserName(userName);
    socket.emit("userLogin", { name: userNameState, id: socket.id });

    socket.on("assignSupport", (data) => {
      console.log("assignSupport....", data);
      if (!data.id) {
        setIsSupportAvailable(true);
        // alert("Sorry! No Support is available this time.");
        // history.push({
        //   pathname: "/customer",
        // });
      }
      localStorage.setItem(
        "customer",
        JSON.stringify({ ...data, socketId: socket.id, userName })
      );
      setSupport(data);
      setTimeout(() => {
        setChat((oldChat) => [
          ...oldChat,
          {
            text: "Hi, Welcome to Quick Support.How can I help you today?",
            class: "left",
          },
        ]);
      }, 700);
    });

    socket.on("receiveMessage", (data) => {
      //play();
      buttonRef.current?.click();
      // socketId
      console.log("receiveMessage call...2222", data);
      setlastMessageTime(new Date());
      setChat((oldChat) => [...oldChat, { text: data.message, class: "left" }]);
      scrollToBottom();
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
      alert("u call disconnect...");
    });

    get({ url: "/support/get-support-qa" }).then((items) => {
      console.log(items);
      setQa(items.data);
    });

    const timer = setInterval(autoLogout, 20 * 1000);

    window.addEventListener("beforeunload", (event) => {
      event.returnValue = `Are you sure you want to leave chat?`;
    });

    // window.onbeforeunload = confirmExit;
    // function confirmExit() {
    //   const { newSupport, newUserNameState } = getState();
    //   console.log(support, userNameState, '...autoLogout', newSupport, newUserNameState, socket.id);
    //   socket.emit('sentMessageLogoutToRoom', { sendTo: newSupport.id, name: newUserNameState, id: socket.id });
    //   setBlockUi(true);
    //   return "show warning";
    // }

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  const sendMessage = () => {
    console.log("sent message call", userNameState);
    if (chatText === "") {
      return false;
    }
    socket.emit("sentMessageRoom", {
      support: support,
      name: userNameState,
      id: socket.id,
      message: chatText,
      sendTo: support.id,
    });
    setChat((oldChat) => [...oldChat, { text: chatText, class: "right" }]);
    setChatText("");
    console.log(Date.now(), "...Date.now()");
    setlastMessageTime(new Date());
    scrollToBottom();
    // socket.to(support.id).emit('receiveMessage', { name: '', id: socket.id, message: 'Hi..' });
  };

  const handleChange = (event) => {
    console.log(chatText, "...chatText");
    setChatText(event.target.value);
  };

  const handleKeyDown = (e) => {
    console.log("handleKeypress", e.keyCode);
    //it triggers by pressing the enter key
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendQa = (val) => {
    setChat((oldChat) => [
      ...oldChat,
      { text: val.qus, class: "right" },
      { text: val.ans, class: "left" },
    ]);
    setlastMessageTime(new Date());
    scrollToBottom();
  };

  const backToHome = () => {
    history.push({
      pathname: "/customer",
    });
  };

  const LoadQuickQa = () => {
    return QA.map((val, i) => {
      return (
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Chip
            icon={<LiveHelp />}
            label={val.qus}
            clickable
            onClick={() => sendQa(val)}
            style={{
              fontWeight: "bold",
              fontSize: "15px",
              margin: "20px 20px 0 0",
              width: "80%",
            }}
            title={val.qus}
            color="primary"
          />
        </Grid>
      );
    });
  };

  const classes = useStyles();
  console.log(support, userNameState, "...support in render");
  return (
    <div style={{ height: window.innerHeight }}>
      <Dialog
        open={isSupportAvailable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Sorry support not available at this time.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Support is available 8am to 5pm monday to friday only.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus onClick={backToHome}>
            Try after some time
          </Button>
        </DialogActions>
      </Dialog>
      <button
        onClick={play}
        ref={buttonRef}
        style={{ display: "none" }}
      ></button>
      <Grid
        container
        component={Paper}
        className={classes.chatSection}
        style={{ height: "100%" }}
      >
        <Grid
          item
          xs={3}
          className={classes.borderRight500}
          style={{
            backgroundColor: "#14A769",
            color: "white",
            backgroundImage:
              "linear-gradient(to top right, #14a769 30%, #39b98f 100%)",
          }}
        >
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  {" "}
                  <Avatar
                    alt="Remy Sharp"
                    style={{ backgroundColor: "orange" }}
                  >
                    {userNameState && userNameState[0].toUpperCase()}
                    {userNameState && userNameState[1].toUpperCase()}
                  </Avatar>
                </StyledBadge>
              </ListItemIcon>
              <ListItemText
                primary={userNameState && userNameState.toUpperCase()}
              ></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <LoadQuickQa />
        </Grid>
        <Grid item xs={9}>
          <Grid item className={classes.headerMessage}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="Support" src={support.image} />
            </StyledBadge>
            <span style={{ paddingLeft: "10px" }}>{support.name}</span>
            <ExitToAppIcon className={classes.logoutClass} />
          </Grid>
          <div>
            <List className={classes.messageArea}>
              {chatList.map((val, i) => {
                return (
                  <ListItem key={i}>
                    <Grid container>
                      <Grid item xs={12}>
                        <ListItemText
                          // align={val.class}
                          ref={messagesEndRef}
                          primary={val.text}
                          className={classes.textDiv}
                          style={{
                            float: val.class,
                            background:
                              val.class === "left"
                                ? "#e8e7e79c"
                                : "linear-gradient(to top right, #14a769 30%, #39b98f 100%) ",
                            color: val.class === "left" ? "black" : "white ",
                          }}
                        ></ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          </div>
          <Grid
            container
            style={{
              padding: "10px",
              backgroundColor: "#f1f0f0",
              position: "fixed",
              bottom: "0px",
              width: "75%",
            }}
          >
            <Grid item xs={11}>
              <input
                type="text"
                placeholder="Type your message here..."
                value={chatText}
                onChange={(event) => handleChange(event)}
                onKeyDown={handleKeyDown}
                className={classes.inputBox}
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab
                style={{ backgroundColor: "#1e9567", color: "#ffffffdb" }}
                aria-label="add"
              >
                <SendIcon onClick={sendMessage} />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerChat;
