import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import Pusher from "pusher-js";
import "./index.css";
import { PusherProivder } from "./context/PusherContext";

const queryClient = new QueryClient();
const NEXT_PUBLIC_KEY: any = "process.env.NEXT_PUBLIC_KEY";
export const pusher = new Pusher(NEXT_PUBLIC_KEY, {
  cluster: "us2",
});

console.log(pusher);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PusherProivder pusher={pusher}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PusherProivder>
  </React.StrictMode>
);
