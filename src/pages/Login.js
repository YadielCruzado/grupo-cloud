import React, { useState } from "react";
import "../css/admin.css";



export default function LogIn() {

  const [email, setEmail] = useState("");
  const [employeeNum, setEmployeeNum] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    const data = {
      email: email,
      employee_num: employeeNum,
    };
    fetch("http://localhost:8080/adminrest/Login", {
          method: "POST",
          headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
          data: data}),
    }).then(response => response.json())
    .then(value => {
      console.log(value)
      if(value.status){
        if(value.role === "admin"){
          localStorage.setItem("selectedRestaurantIndex", value.rest);
          window.location.href = "AdminRest";
        } else if(value.role === "employee"){
          localStorage.setItem("selectedRestaurantIndex", value.rest);
          window.location.href = "AdminRest";
        }
      } else{
        window.location.href = "login";
      }
    })
  };

  return (
    <div className="adminBody">
      <section className="reservation">
        <form onSubmit={handleSubmit}>
          <h1>Administrator Log In</h1>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <br />

          <label htmlFor="employeeNum">Employee Number:</label>
          <input
            type="number"
            id="employeeNum"
            name="employeeNum"
            value={employeeNum}
            onChange={(e) => setEmployeeNum(e.target.value)}
            required
          />
          <br />
          <br />

          <button type="submit" className="btn">
            Enter
          </button>
        </form>
      </section>
    </div>
  );
}
