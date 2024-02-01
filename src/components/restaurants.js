import React, { useEffect, useState } from "react";
import "../css/restaurant.css";

export const restaurants = [
  {
    name: "Applebees",
    image: require("../images/applebees.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/applebees1.jpg"),
      require("../images/Gallery/applebees2.jpeg"),
      require("../images/Gallery/applebees3.png"),
    ],
  },
  {
    name: "Chilis",
    image: require("../images/chilis.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/chillis1.avif"),
      require("../images/Gallery/chillis2.avif"),
      require("../images/Gallery/chillis3.jpg"),
    ],
  },
  {
    name: "Olive Gardens",
    image: require("../images/olive.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/applebees1.jpg"),
      require("../images/Gallery/applebees2.jpeg"),
      require("../images/Gallery/applebees3.png"),
    ],
  },
  {
    name: "Sizzler",
    image: require("../images/sizzler.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/applebees1.jpg"),
      require("../images/Gallery/applebees2.jpeg"),
      require("../images/Gallery/applebees3.png"),
    ],
  },
  {
    name: "Denny's",
    image: require("../images/dennys.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/chillis1.avif"),
      require("../images/Gallery/chillis2.avif"),
      require("../images/Gallery/chillis3.jpg"),
    ],
  },
  {
    name: "Ponderosa",
    image: require("../images/ponderosa.png"),
    link: "/information",
    gallery: [
      require("../images/Gallery/chillis1.avif"),
      require("../images/Gallery/chillis2.avif"),
      require("../images/Gallery/chillis3.jpg"),
    ],
  },
];

export default function Restaurants() {
  const handleClick = (link, index) => {
    localStorage.setItem("selectedRestaurantIndex", index);
    window.location.href = link;
  };

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
      <div class="container">
        <div class="row2">
          {rests.map((restaurant, index) => (
            <div>
              <div key={index} id={index} class="card">
                <div>
                  <h1>{restaurant.name}</h1>
                </div>
                <img
                  src={require(`../images/${restaurant.image}`)}
                  class="card-img-top"
                  alt="Waterfall"
                />
                <div class="card-body">
                  <button
                    className="btn btn-transparent"
                    onClick={() => handleClick(restaurant.link, index)}
                  >
                    See more information
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
