import React, { useEffect, useState } from "react";

import "../css/admin.css";
import AddRestaurant from "../components/addRestaurant";

export default function AdminOwner() {
  const [rests, setRests] = useState([]);
  useEffect(() => {
    const getData = () => {
      fetch("http://localhost:8080/restaurant/allRestaurants")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setRests(data.data);
        });
    };

    getData();
  }, []);
  return (
    <>
      <header>
        <h1>Administrator Page: General</h1>
      </header>

      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h1>Your Restaurants</h1>
            <ul class="list-group list-group-flush">
              {rests.map((restaurant, index) => (
                <li class="list-group-item">
                  <i class="fas fa-utensils"></i>
                  <span>{restaurant.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <AddRestaurant />
        </div>
      </div>
      <script src="admin.js"></script>
    </>
  );
}
