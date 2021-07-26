import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Header from "../Common/header";
import useStyles from "./customer-chat-css";

const CustomerLogin = ({ handleClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userName);
    history.push({
      pathname: "/customer/chat",
      state: { userName },
    });
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.mainLogin}
    >
      <div className={classes.wrapperDivLogin}>
        <Header />
        <h4 style={{ color: "rgba(68, 68, 68, 0.75)", textAlign: "center" }}>
          Start Chat with Support
        </h4>
        <form className={classes.rootLogin} onSubmit={handleSubmit}>
          <TextField
            label="Enter Your Name"
            variant="filled"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <div>
            <Button
              type="submit"
              size="large"
              variant="contained"
              style={{
                backgroundColor: "#14A769",
                width: "250px",
                color: "white",
              }}
            >
              Start Chat
            </Button>
          </div>
        </form>
      </div>
    </Grid>
  );
};
export default CustomerLogin;
