import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import useStyles from "./home-css";

const Home = ({ socket }) => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.main}
    >
      <List className={classes.root}>
        <div className={classes.wrapperDiv}>
          <img
            src="./logo.png"
            alt="loading..."
            className={classes.logoImage}
          ></img>
        </div>
        <Divider className={classes.dividerClass} />
        <div
          className={classes.buttonClass}
          style={{ float: "left" }}
          onClick={() => history.push("/support")}
        >
          <LockOpenSharpIcon className={classes.loginIcon} />
          Login as support
        </div>
        <div
          className={classes.buttonClass}
          style={{ float: "right" }}
          onClick={() => history.push("/customer")}
        >
          <LockOpenSharpIcon className={classes.loginIcon} />
          Login as customer
        </div>
      </List>
    </Grid>
  );
};

export default Home;
