import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import "./index.css";
import i18n from "./i18n";

const setDirection = () => {
  const language = i18n.language;
  document.documentElement.dir = language === "he" ? "rtl" : "ltr";
};

setDirection();

i18n.on("languageChanged", setDirection);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="965008521931-eq4010ukchibqsc69orami7385pk5grm.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
