import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";

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

export { StyledBadge };

const { innerHeight: height } = window;
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
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
      backgroundColor: "#14A769",
      color: "white",
      backgroundImage:
        "linear-gradient(to top right, #14a769 30%, #39b98f 100%)",
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
      cursor: "pointer",
    },
    inputContainer: {
      padding: "10px",
      backgroundColor: "#f1f0f0",
      position: "fixed",
      bottom: "0px",
      width: "58%",
    },
    rootLogin: {
      width: "100%",
      maxWidth: 600,
      backgroundColor: "#F8F9FA",
      borderRadius: "5px",
      padding: "10px 20px 30px 30px",
    },
    mainLogin: {
      backgroundColor: "#14A769",
      backgroundImage: "linear-gradient(#14A769, #38B88E)",
      height: height,
    },
    h3HeadingLogin: {
      marginBottom: "50px",
      color: "rgba(68, 68, 68, 0.75)",
    },
  })
);

export default useStyles;
