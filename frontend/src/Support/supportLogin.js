import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SupportLogin = ({ socket }) => {
  const [supportList, setSupportList] = useState([]);
  const [loginError, setLoginError] = useState(false);
  const [supportPassword, setSupportPassword] = useState({});
  const { innerWidth: width, innerHeight: height } = window;

  useEffect(() => {
    const loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
      const user = JSON.parse(loginUser);
      if (user && user.token) {
        console.log("enter if");
        history.push("/support/chat");
      }
    }

    get({ url: "/support/get-support-team" }).then((items) => {
      console.log(items);
      setSupportList(items.data);
    });

    socket.on("supportLoginCall", (data) => {
      setSupportList(supportList.filter((val) => val.id !== data.id));
    });
  }, []);

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        width: "100%",
        maxWidth: 600,
        backgroundColor: "#F8F9FA",
        borderRadius: "5px",
        padding: "10px 20px 30px 30px",
      },
    })
  );
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
        console.log("error...");
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
      style={{
        backgroundColor: "#14A769",
        backgroundImage: "linear-gradient(#14A769, #38B88E)",
        height: height,
      }}
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
      <List className={classes.root}>
        <img
          src="./logo.png"
          alt="loading..."
          style={{ marginTop: "20px" }}
        ></img>

        <h3 style={{ marginBottom: "50px", color: "rgba(68, 68, 68, 0.75)" }}>
          Login as Support Agent
        </h3>
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
