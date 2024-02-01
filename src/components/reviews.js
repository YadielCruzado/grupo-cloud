import React, { useState } from "react";
import { restaurants } from "../components/restaurants";

export default function Reviews() {
  //se obtiene el index del arreglo para cargar la informacion del restaurante
  const index = localStorage.getItem("selectedRestaurantIndex");
  const restaurant = restaurants[index];

  function getreviews() {
    //se recibe la respuesta del servidor
    fetch("http://localhost:8080/adminrest/getreviews/" + restaurant.name)
      .then((response) => response.json())
      .then((response) => {
        //se selecciona el area donde y se limpia
        const area = document.getElementById("area");
        area.innerHTML = "";

        //funcion que crea el numero de strellas del review
        function createStarRating(stars) {
          const filledStars = "★".repeat(stars);
          const emptyStars = "☆".repeat(5 - stars);
          return filledStars + emptyStars;
        }
        //para cada elemento se crea un review
        response.forEach((element) => {
          //se crean todos los elementos del review
          const div = document.createElement("div");
          div.classList.add("revarea");

          const div1 = document.createElement("div");
          div1.classList.add("review");

          const div2 = document.createElement("div");
          div2.classList.add("revinfo");

          const divR1 = document.createElement("div");
          divR1.classList.add("row");
          const divC6_name = document.createElement("div");
          divC6_name.classList.add("col-6");

          const h2 = document.createElement("h2");
          //se le pone la data al elemento indicado
          h2.textContent = element.reviewer_name;
          div2.appendChild(divR1);
          divR1.appendChild(divC6_name);
          divC6_name.appendChild(h2);

          const div3 = document.createElement("div");
          div3.classList.add("row");
          const divC6_rating = document.createElement("div");
          divC6_rating.classList.add("col-6");

          const h3 = document.createElement("h3");
          //usando la variable restaurants se le pone el nombre del restaurante
          h3.textContent = element.restaurant;

          const span = document.createElement("span");
          //se usa la funcion de crear stars para anadir las strellas al review
          span.textContent = createStarRating(parseInt(element.stars, 10));
          div3.appendChild(divC6_rating);
          div2.appendChild(div3);
          divC6_rating.appendChild(h3);
          divC6_rating.appendChild(span);

          const divR2 = document.createElement("div");
          divR2.classList.add("row");
          const divcol12 = document.createElement("div");
          divcol12.classList.add("col-12");
          const p = document.createElement("p");
          p.textContent = element.review;

          div1.appendChild(div2);
          div1.appendChild(divR2);
          divR2.appendChild(divcol12);
          divcol12.appendChild(p);

          //si el review tiene algun comment se presenta
          if (element.coments !== "") {
            element.comments.forEach((a) => {
              const div4 = document.createElement("div");
              div4.classList.add("coments");
              const div5 = document.createElement("div");
              div5.classList.add("row");
              const divCAdmin = document.createElement("div");
              divCAdmin.classList.add("col-6");

              const h4 = document.createElement("h2");
              h4.textContent = "Admin comment:";
              div5.appendChild(h4);
              const divCcomment = document.createElement("div");
              divCcomment.classList.add("col-6");

              const p4 = document.createElement("p");
              p4.textContent = a;

              div4.appendChild(div5);
              div5.appendChild(divCAdmin);
              div5.appendChild(divCcomment);
              div1.appendChild(div4);
              divCAdmin.appendChild(h4);
              divCcomment.appendChild(p4);
            });
          }

          div.appendChild(div1);

          area.appendChild(div);
        });
      });
  }

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("1");

  function makereview() {

    const data = {
      reviewer_name: name,
      restaurant: restaurant.name,
      review: comment,
      stars: rating, 
      comments: [],
    };

    fetch("http://localhost:8080/adminrest/makereview", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
      }),
    });

    window.location.reload();
  }

  getreviews();
  return (
    <>
      <div class="container">
        <h1>{restaurant ? restaurant.name : ""} Reviews</h1>
        <div class="reviews" id="area"></div>
      </div>

      <div class="leaveRev">
        <h1>Leave a Review</h1>
        <form onSubmit={makereview}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br />

          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
          </select>
          <br />
          <br />

          <label htmlFor="comment">Comment: </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
