import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import LockOpen from "@material-ui/icons/LockOpen";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { get, post } from "../helper/service";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "../Common/header";
import useStyles from "./support-chat-css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SupportLogin = ({ socket }) => {
  const [supportList, setSupportList] = useState([]);
  const [loginError, setLoginError] = useState(false);
  const [supportPassword, setSupportPassword] = useState({});

  useEffect(() => {
    const loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
      const user = JSON.parse(loginUser);
      if (user && user.token) {
        history.push("/support/chat");
      }
    }

    get({ url: "/support/get-support-team" }).then((items) => {
      setSupportList(items.data);
    });

    socket.on("supportLoginCall", (data) => {
      setSupportList(supportList.filter((val) => val.id !== data.id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const history = useHistory();

  const login = (userData) => {
    post({
      url: "/support/login",
      data: { ...userData, password: supportPassword[userData.id] },
    })
      .then((response) => {
        localStorage.setItem(
          "loginUser",
          JSON.stringify({
            socketId: socket.id,
            ...response.data?.data,
          })
        );
        history.push("/support/chat");
      })
      .catch(() => {
        setLoginError(true);
      });
  };

  const handleClose = () => {
    setLoginError(false);
  };

  const handleChange = (event, id) => {
    setSupportPassword({ [id]: event.target.value });
  };

  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.mainLogin}
    >
      <Snackbar
        open={loginError}
        autoHideDuration={10000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleClose}>
          <b>Login details you entered not matched with our record !</b>
        </Alert>
      </Snackbar>
      <List className={classes.rootLogin}>
        <Header />
        <h3 className={classes.h3HeadingLogin}>Login as Support Agent</h3>
        {supportList.map((item, index) => (
          <>
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <Avatar alt="" src={item.image} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={item.id} />
              <TextField
                id="standard-basic"
                label="Enter your secret PIN"
                type="password"
                value={supportPassword[item.id]}
                onChange={(event) => handleChange(event, item.id)}
              />
              <Fab
                color="primary"
                aria-label="add"
                size="small"
                style={{ backgroundColor: "#14A769" }}
                onClick={() => login(item)}
              >
                <LockOpen style={{ backgroundColor: "#14A769" }} />
              </Fab>
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </Grid>
  );
};

export default SupportLogin;
