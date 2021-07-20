import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const CustomerLogin = ({ handleClose }) => {
  const classes = useStyles();
  const history = useHistory();
  // create state variables for each input
  const { innerWidth: width, innerHeight: height } = window;
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
      style={{
        backgroundColor: "#14A769",
        backgroundImage: "linear-gradient(#14A769, #38B88E)",
        height: height,
      }}
    >
      <div
        style={{
          height: "350px",
          backgroundColor: "#F8F9FA",
          borderRadius: "5px",
          padding: "5px 20px 30px 30px",
          paddingTop: "5%",
          width: "400px",
        }}
      >
        <img src="./logo.png" alt="loading..." style={{ marginTop: '10px' }}></img>
        <h4 style={{ color: 'rgba(68, 68, 68, 0.75)' }}>Start Chat with Support</h4>
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField
            label="Enter Your Name"
            variant="filled"
            required
            value={userName}
            // style={{ backgroundColor: '#EBEBEB' }}
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
