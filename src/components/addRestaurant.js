import React, { useState } from "react";

export default function AddRestaurant() {
  const [name, Setname] = useState([]);
  const [info, Setinfo] = useState([]);
  const [menu, setmenu] = useState([]);
  const [beberages, setBeberages] = useState([]);
  const [appetizer, setAppetizer] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [principal, setPrincipal] = useState([]);
  const [res, setRes] = useState([]);

  const activateBox = (target) => {
    const element = document.getElementById(target.name);
    if (target.checked) {
      element.type = "text";
    } else {
      element.type = "hidden";
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (name !== "" && info !== "") {
      const Menu = {
        beberages: beberages,
        appetizer: appetizer,
        desserts: desserts,
        principal: principal,
      };
      setmenu(Menu);
      fetch("http://localhost:8080/restaurant/createRestaurant", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          info: info,
          menu: menu,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.error !== "none") {
            setRes(data.error);
          } else {
            setRes(data.message);
          }
        });
    }
  };

  return (
    <div class="col-md-6 reservAdd">
      <h1>{res}</h1>
      <h1>Add a New Restaurant</h1>
      <form onSubmit={handleClick}>
        <div>
          <label for="name">Restaurant name: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            placeholder="Restaurant Name"
            onChange={(e) => Setname(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label for="info">Restaurant info: </label>
          <textarea
            type="textarea"
            id="info"
            name="info"
            value={info}
            placeholder="Information about the Restaurant"
            onChange={(e) => Setinfo(e.target.value)}
          ></textarea>
        </div>
        <br />
        <div>
          <label for="images">Restaurant images: </label>
          <input
            type="text"
            id="images"
            name="image"
            placeholder="Add images"
          />
        </div>
        <br />
        <div class="checkArea">
          <h4>Menu:</h4>
          <label>Appetizers</label>
          <input
            type="checkbox"
            id="1"
            name="appetizer"
            value="appetizer"
            onClick={(e) => activateBox(e.target)}
          />
          <input
            type="hidden"
            id="appetizer"
            value={appetizer}
            placeholder="item1, item2"
            onChange={(e) => setAppetizer(e.target.value)}
          />
          <br />
          <label>Beberages</label>
          <input
            type="checkbox"
            id="2"
            name="beberages"
            value="beberages"
            onClick={(e) => activateBox(e.target)}
          />
          <input
            type="hidden"
            id="beberages"
            value={beberages}
            placeholder="item1, item2"
            onChange={(e) => setBeberages(e.target.value)}
          />
          <br />
          <label>Desserts</label>
          <input
            type="checkbox"
            id="3"
            name="desserts"
            value="desserts"
            onClick={(e) => activateBox(e.target)}
          />
          <input
            type="hidden"
            id="desserts"
            value={desserts}
            placeholder="item1, item2"
            onChange={(e) => setDesserts(e.target.value)}
          />
          <br />
          <label>Principal</label>
          <input
            type="checkbox"
            id="4"
            name="principal"
            value="principal"
            onClick={(e) => activateBox(e.target)}
          />
          <input
            type="hidden"
            id="principal"
            value={principal}
            placeholder="item1, item2"
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <button type="submit" class="btn">
          Add Restaurant
        </button>
      </form>
    </div>
  );
}
