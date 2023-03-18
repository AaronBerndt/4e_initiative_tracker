import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import Pusher from "pusher-js";
import "./index.css";
import { PusherProivder } from "./context/PusherContext";

const queryClient = new QueryClient();
const NEXT_PUBLIC_KEY: any = import.meta.env.VITE_PUBLIC_KEY;
console.log(import.meta.env);
export const pusher = new Pusher(NEXT_PUBLIC_KEY, {
  cluster: "us2",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PusherProivder pusher={pusher}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PusherProivder>
  </React.StrictMode>
);
