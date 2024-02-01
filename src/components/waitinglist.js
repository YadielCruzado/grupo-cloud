import React, { useState, useEffect } from "react";
import { restaurants } from "./restaurants";


export default function waitlist() {
  const index = localStorage.getItem("selectedRestaurantIndex");
  const restaurant = restaurants[index];

  function list() {
    fetch("http://localhost:8080/adminrest/getwaitinglist/"+ restaurant.name)
    .then(response => response.json())
    .then(result => {

      console.log(result)
    });
  }

  list()

  return (
    <section className="waitlist">
    <h1>Waitlist</h1>
    <table>
      <thead>
        <tr>
          <th scope="col">reservation number</th>
          <th scope="col">Name</th>
          <th scope="col">group of people</th>
          <th scope="col">estimated time</th>
        </tr>
      </thead>
      <tbody id="tbody">

      </tbody>
    </table>
    </section>
  );
}