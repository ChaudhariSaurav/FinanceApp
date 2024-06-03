import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const { customerId } = location.state || {};
  const storedCustomerId = localStorage.getItem("customerId");
  return (
    <>
      <Navbar customerId={customerId || storedCustomerId} />
    </>
  );
}

export default Dashboard;
