import * as React from "react";
import * as ReactDOM from "react-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";

import App from "./App";

import "./main.sass";

declare let connection: WebSocket;

const log = console.log;
console.log = (...args) => {
  log("[CLIENT]", ...args);
};

const error = console.error;
console.error = (...args) => {
  error("[CLIENT]", ...args);
};

const interval = setInterval(() => {
  if (window.skymp) {
    window.skymp.on("error", (err) => {
      console.error(err);
      window.mp.send("error", err);
    });

    window.skymp.on("message", (action: any) => {
      console.log(action);
      window.storage.dispatch(action);
    });

    window.skymp.on("open", () => {
      window.mp.send("socketOpen", {});
    });

    clearInterval(interval);
  }
}, 100);

const interval2 = setInterval(() => {
  if (connection.readyState === WebSocket.OPEN) {
    window.skymp.send({
      type: "socketOpen",
      data: {},
    });
    clearInterval(interval2);
  }
}, 500);

window.mp = {
  send: (type: string, data: any) => {
    try {
      if (connection.readyState === WebSocket.OPEN) {
        window.skymp.send({
          type,
          data,
        });
      } else {
        console.log("[SEND]", {
          type,
          data,
        });
      }
    } catch {
      console.error(type, data);
    }
  },
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
