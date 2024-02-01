import React, { useState, useEffect } from "react";
import { restaurants } from "../restaurants";
import "../../css/infoRest.css";
import Menu from "./menu";
import FormReserv from "../Admin/formReserv";
import Reviews from "../reviews";

function Slideshow({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change the duration (in milliseconds) between each slide

    return () => {
      clearInterval(interval);
    };
  }, [images]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slideshow">
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        className="slideshowImage"
        onClick={handleNextImage}
      />
      <div className="slideshowArrows"></div>
    </div>
  );
}

export default function Information() {
  const index = localStorage.getItem("selectedRestaurantIndex");
  const [rests, setRests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/restaurant/allRestaurants")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRests(data.data);
      });
  }, []);

  const restaurant = rests[index];
  const restauran = restaurants[index];

  console.log(restaurant);

  return (
    <>
      <body>
        <header
          style={{
            backgroundImage: `url(${require("../../images/back6.jpg")})`,
          }}
        >
          <h1>{restaurant ? restaurant.name : ""}</h1>
          <div class="adminbtn">
            <button onClick={() => (window.location.href = "/login")}>
              {" "}
              Enter as Manager{" "}
            </button>
          </div>
        </header>
      </body>
      <section class="restInfo">
        <div>
          <img
            src={restaurant ? require(`../../images/${restaurant.image}`) : ""}
          />
          <Slideshow images={restauran ? restauran.gallery : ""} />
        </div>
      </section>

      <Menu restaurantIndex={index} />
      <FormReserv restaurantIndex={index}  />
      <Reviews restaurantIndex={index} />
    </>
  );
}
