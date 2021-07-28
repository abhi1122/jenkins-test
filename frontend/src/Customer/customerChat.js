import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Divider from "@material-ui/core/Divider";
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
import useStyles, { StyledBadge } from "./customer-chat-css";

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
  const [isSupportAvailable, setIsSupportAvailable] = useState(false);
  const buttonRef = useRef();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
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
    const startTime = newLastMessageTime;
    const endTime = new Date();
    const difference = endTime.getTime() - startTime.getTime();
    const resultInMinutes = Math.round(difference / 60000);
    if (resultInMinutes > 5) {
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
    if (!userName) {
      const {
        socketId,
        id,
        userName: customerName,
      } = JSON.parse(localStorage.getItem("customer"));
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
      if (!data.id) {
        setIsSupportAvailable(true);
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
      buttonRef.current?.click();
      setlastMessageTime(new Date());
      setChat((oldChat) => [...oldChat, { text: data.message, class: "left" }]);
      scrollToBottom();
    });

    socket.on("disconnect", () => {
      alert("Disconnected...");
    });

    get({ url: "/support/get-support-qa" }).then((items) => {
      setQa(items.data);
    });

    const timer = setInterval(autoLogout, 20 * 1000);

    window.addEventListener("beforeunload", (event) => {
      event.returnValue = `Are you sure you want to leave chat?`;
    });

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", () => { });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
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
    setlastMessageTime(new Date());
    scrollToBottom();
  };

  const handleChange = (event) => {
    setChatText(event.target.value);
  };

  const handleKeyDown = (e) => {
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
            className={classes.chipClass}
            title={val.qus}
            color="primary"
          />
        </Grid>
      );
    });
  };

  const classes = useStyles();
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
        value={lastMessageTime}
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
          <Grid container className={classes.inputContainer}>
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
