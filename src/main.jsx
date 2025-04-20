import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Footer from "./components/Footer";
import AppProvider from "./context/AppContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <>
        <App />
        <Footer />
      </>
    </AppProvider>
  </React.StrictMode>
);
