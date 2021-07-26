import React, { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import useSound from "use-sound";
import boopSfx from "../sound/sound.mp3";
import Badge from "@material-ui/core/Badge";
import Skeleton from "@material-ui/lab/Skeleton";
import Chip from "@material-ui/core/Chip";
import LiveHelp from "@material-ui/icons/HelpOutline";
import useStyles, { StyledBadge } from "./support-chat-css";
import { get } from "../helper/service";

import { useHistory } from "react-router-dom";

export default function SupportChat({ socket }) {
  const [chatList, setChat] = useState({});
  const [QA, setQa] = useState([]);
  const [unread, setUnread] = useState({});
  const [messageTime, setMessageTime] = useState({});
  const [chatText, setChatText] = useState("");
  const [sendTo, setsendTo] = useState(null);
  const [sendToName, setsendToName] = useState(null);
  const [play] = useSound(boopSfx, { volume: 0.1 });
  const buttonRef = useRef();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    console.log("calll scrollToBottom");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  useEffect(() => {
    const loginUser = localStorage.getItem("loginUser");

    get({ url: "/support/get-support-qa" }).then((items) => {
      setQa(items.data);
    });

    socket.on("userOffline", (data) => {
      const customerName = `${data.id}##__${data.name}`;
      setsendTo((old) => (old === data.id ? null : old));
      setsendToName((old) => (old === customerName ? null : old));
      setChat((oldChat) => {
        delete oldChat[customerName];
        return { ...oldChat };
      });
    });

    socket.on("receiveMessage", (data) => {
      buttonRef.current?.click();
      const newUserId = `${data.id}##__${data.name}`;
      let activeCustomer = null;
      setsendTo((old) => {
        activeCustomer = old;
        return old;
      });

      if (activeCustomer !== data.id) {
        setUnread((old) => {
          const count = old[newUserId] + 1;
          return { ...old, [newUserId]: count };
        });
      }

      setMessageTime((old) => ({ ...old, [newUserId]: new Date() }));

      setInterval(() => {
        let newLastMessageTime = {};
        setMessageTime((old) => {
          newLastMessageTime = { ...old };
          return old;
        });
        console.log("checking for old chats...", newLastMessageTime);
        const offlineCustomer = Object.keys(newLastMessageTime).filter(
          (val) => {
            const startTime = newLastMessageTime[val];
            const endTime = new Date();
            const difference = endTime.getTime() - startTime.getTime();
            const resultInMinutes = Math.round(difference / 60000);
            console.log(val, "========", resultInMinutes);
            if (resultInMinutes > 1) {
              return val;
            }
          }
        );

        offlineCustomer.map((customerName) => {
          const id = customerName.split("##__")[0];
          setsendTo((old) => (old === id ? null : old));
          setsendToName((old) => (old === customerName ? null : old));
          setChat((oldChat) => {
            delete oldChat[customerName];
            return { ...oldChat };
          });
        });
      }, 20 * 1000);

      setChat((oldChat) => {
        console.log(newUserId, "...data");
        let newChat = [];
        if (oldChat[newUserId]) {
          let { message = [] } = oldChat[newUserId];
          console.log(message, "..message");
          newChat = {
            ...data,
            message: [...message, { text: data.message, class: "left" }],
          };
        } else {
          setUnread((old) => ({ ...old, [newUserId]: 1 }));
          newChat = {
            ...data,
            message: [{ text: data.message, class: "left" }],
          };
        }
        console.log(newChat, "...newChat");
        return { ...oldChat, [newUserId]: newChat };
      });

      console.log(chatList, "...chatList", unread);

      scrollToBottom();
    });

    socket.emit("supportLogin", { ...JSON.parse(loginUser) });
  }, []);

  const handleChange = (event) => {
    setChatText(event.target.value);
  };

  const sendMessage = (messageText = chatText) => {
    console.log("sent message call");
    if (messageText === "") {
      return false;
    }

    socket.emit("sentMessageRoom", {
      support: {},
      name: "",
      id: socket.id,
      message: messageText,
      sendTo: sendTo,
    });

    setChat((oldChat) => {
      const newSendTo = sendToName;
      const { message = [] } = oldChat[newSendTo];
      let newChat = [];
      console.log(message, "...message");
      newChat = {
        message: [...message, { text: messageText, class: "right" }],
      };
      return { ...oldChat, [newSendTo]: newChat };
    });
    setChatText("");

    scrollToBottom();
  };

  const sendQa = (val) => {
    if (sendTo) {
      sendMessage(val.ans);
    }
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

  const loadChat = (chatData) => {
    setsendTo(chatData.id);
    setsendToName(`${chatData.id}##__${chatData.name}`);
    setUnread((old) => ({ ...old, [`${chatData.id}##__${chatData.name}`]: 0 }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const history = useHistory();

  const logout = () => {
    if (Object.keys(chatList).length === 0) {
      socket.emit("supportOffline", {
        id: JSON.parse(localStorage.getItem("loginUser")).id,
      });
      localStorage.removeItem("loginUser");
      history.push("/support");
    } else {
      alert("Please finish your active chats first.");
    }
  };

  const getUserName = (key) => {
    return key.split("##__")[1];
  };

  return (
    <div style={{ height: window.innerHeight }}>
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
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="support1">
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
                    alt=""
                    src={JSON.parse(localStorage.getItem("loginUser")).image}
                  />
                </StyledBadge>
              </ListItemIcon>
              <ListItemText
                primary={
                  localStorage.getItem("loginUser") &&
                  JSON.parse(localStorage.getItem("loginUser")).name
                }
              ></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List className={classes.root}>
            {Object.keys(chatList).length === 0 && (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="circle" width={40} height={40} />
                <Skeleton variant="rect" width="100%" height={50} />
              </>
            )}
            {Object.keys(chatList).map((key, index) => (
              <>
                <ListItem key={index} onClick={() => loadChat(chatList[key])}>
                  <ListItemIcon>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar alt="" style={{ backgroundColor: "orange" }}>
                        {key && getUserName(key)[0].toUpperCase()}
                        {key && getUserName(key)[1].toUpperCase()}
                      </Avatar>
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: "white" }}
                    primary={getUserName(key)}
                    secondary={
                      chatList[key]["message"][
                        chatList[key]["message"].length - 1
                      ]["text"].length > 25
                        ? chatList[key]["message"][
                            chatList[key]["message"].length - 1
                          ]["text"].substring(0, 25) + "...."
                        : chatList[key]["message"][
                            chatList[key]["message"].length - 1
                          ]["text"]
                    }
                  />
                  {unread[key] > 0 && (
                    <Badge badgeContent={unread[key]} color="primary"></Badge>
                  )}
                </ListItem>{" "}
                <Divider />
              </>
            ))}
          </List>
        </Grid>
        <Grid item xs={7}>
          <Grid item className={classes.headerMessage}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="" style={{ backgroundColor: "orange" }}>
                {sendToName && getUserName(sendToName)[0].toUpperCase()}
                {sendToName && getUserName(sendToName)[1].toUpperCase()}
              </Avatar>
            </StyledBadge>
            <span style={{ paddingLeft: "10px" }}>
              {sendToName ? getUserName(sendToName) : "Waiting for Customer..."}
            </span>
            <ExitToAppIcon className={classes.logoutClass} onClick={logout} />
          </Grid>
          <div>
            <List className={classes.messageArea}>
              {chatList[sendToName] &&
                chatList[sendToName]["message"].map((val, i) => {
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
          {sendTo && (
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
              <Divider />
              <Grid item xs={11}>
                <input
                  type="text"
                  placeholder=" Type your message here..."
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
          )}
        </Grid>

        <Grid item xs={2} className={classes.borderRight500}>
          <LoadQuickQa />
        </Grid>
      </Grid>
    </div>
  );
}
