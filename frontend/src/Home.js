import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";

const Home = ({ socket }) => {
  const { innerWidth: width, innerHeight: height } = window;

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        width: "100%",
        maxWidth: "50%",
        backgroundColor: "#F8F9FA",
        borderRadius: "5px",
        padding: "10px 20px 30px 30px",
      },
      buttonClass: {
        float: "left",
        background: "#2da179f7",
        width: "49%",
        height: "100px",
        display: "flex",
        alignContent: "center",
        flexWrap: "wrap",
        fontSize: "32px",
        fontWeight: " 600",
        color: "white",
        lineHeight: "45px",
        cursor: "pointer",
        marginTop: "15px",
      },
    })
  );
  const history = useHistory();

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
      <List className={classes.root}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <img
            src="./logo.png"
            alt="loading..."
            style={{ marginTop: "20px", width: "230px", height: "100px" }}
          ></img>
        </div>
        <Divider style={{ backgroundColor: "white" }} />
        <div
          className={classes.buttonClass}
          style={{ float: "left" }}
          onClick={() => history.push("/support")}
        >
          <LockOpenSharpIcon style={{ fontSize: "50px" }} />
          Login as support
        </div>
        <div
          className={classes.buttonClass}
          style={{ float: "right" }}
          onClick={() => history.push("/customer")}
        >
          <LockOpenSharpIcon style={{ fontSize: "50px" }} />
          Login as customer
        </div>
        {/* <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.buttonSupport}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.buttonCustomer}
          startIcon={<SaveIcon />}
        >
          Save
        </Button> */}
      </List>
    </Grid>
  );
};

export default Home;
