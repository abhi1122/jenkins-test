import { makeStyles, createStyles } from "@material-ui/core/styles";

const { innerHeight: height } = window;
const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      backgroundColor: "#14A769",
      backgroundImage: "linear-gradient(#14A769, #38B88E)",
      height: height,
    },
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
    loginIcon: {
      fontSize: "50px",
    },
    dividerClass: {
      backgroundColor: "white",
    },
    logoImage: {
      marginTop: "20px",
      width: "230px",
      height: "100px",
    },
    wrapperDiv: {
      width: "100%",
      textAlign: "center",
    },
  })
);

export default useStyles;
