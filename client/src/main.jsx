import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { SocketProvider } from "./context/cocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <>
      <App />
      <Toaster closeButton />
    </>
  </SocketProvider>
);
