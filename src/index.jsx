import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import Layout from "./common/Layout";
import UserRoute from "./common/UserRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		  <Layout>
      <UserRoute />
    </Layout>
	</React.StrictMode>,
);
