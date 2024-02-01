import React, { useState, useEffect } from "react";

import "../../css/infoRest.css";

export default function Menu({ restaurantIndex }) {
  const index = localStorage.getItem("selectedRestaurantIndex");
  const [rests, setRests] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/restaurant/allRestaurants")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRests(data.data);
        let menu = data.data[index].menu;
        for (let i in menu) {
          menu[i] = menu[i].split(",");
        }
        setMenu(menu);
      });
  }, [index]);

  return (
    <>
      <section class="menu">
        <h2>Menú</h2>
        <div>
          <div>
            <h3>Appetizers</h3>
            {
              <ul>
                {menu.appetizer
                  ? menu.appetizer.map((item) => <li>{item}</li>)
                  : ""}
              </ul>
            }
          </div>

          <div>
            <h3>Beberages</h3>
            {
              <ul>
                {menu.beberages
                  ? menu.beberages.map((item) => <li>{item}</li>)
                  : ""}
              </ul>
            }
          </div>

          <div>
            <h3>Desserts</h3>
            {
              <ul>
                {menu.desserts
                  ? menu.desserts.map((item) => <li>{item}</li>)
                  : ""}
              </ul>
            }
          </div>
          <div>
            <h3>Principal</h3>
            {
              <ul>
                {menu.principal
                  ? menu.principal.map((item) => <li>{item}</li>)
                  : ""}
              </ul>
            }
          </div>
        </div>
      </section>
    </>
  );
}
