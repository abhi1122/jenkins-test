import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import SupportLogin from "./Support/supportLogin";
import SupportChat from "./Support/supportChat";
import CustomerLogin from "./Customer/customerLogin";
import CustomerChat from "./Customer/customerChat";
import Home from "./Home";

const socket = io(process.env.REACT_APP_SOCKET_URL);
socket.on("connect", () => {});

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
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
  );
}

export default App;
