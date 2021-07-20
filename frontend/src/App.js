import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SupportLogin from "./Support/supportLogin";
import SupportChat from "./Support/supportChat";
import CustomerLogin from "./Customer/customerLogin";
import CustomerChat from "./Customer/customerChat";


import {
  io
} from "socket.io-client";

const socket = io("http://192.168.1.6:3011");
socket.on("connect", () => {
  console.log(socket.id, '...id'); // ojIckSD2jqNzOqIrAGzL

});
// import { io } from "socket.io-client";
// const socket = io("http://192.168.1.6:3011");
// socket.on("hello", (val) => {
//   alert(val);
// });
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/support/chat">
            <SupportChat socket={socket} />
          </Route>
          <Route path="/support">
            <SupportLogin socket={socket} />
          </Route>
          <Route path="/customer/chat">
            <CustomerChat socket={socket} />
          </Route>
          <Route path="/customer">
            <CustomerLogin socket={socket} />
          </Route>
        </Switch>
      </Router>
    </div>
    //  <header className="App-header">
    //   <img src={logo} className="App-logo" alt="logo" />
    //   <p>
    //     Edit <code>src/App.js</code> and save to reload.
    //   </p>
    //   <a
    //     className="App-link"
    //     href="https://reactjs.org"
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     Learn React
    //   </a>
    // </header>
  );
}

export default App;
