import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    logoImage: {
      marginTop: "20px",
      width: "210px",
      height: "90px",
    },
    wrapperDiv: {
      width: "100%",
      textAlign: "center",
    },
  })
);
const Header = ({ socket }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapperDiv}>
      <img
        src="./logo.png"
        alt="loading..."
        className={classes.logoImage}
      ></img>
    </div>
  );
};

export default Header;
