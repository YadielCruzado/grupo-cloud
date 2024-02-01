import { restaurants } from "../components/restaurants";
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

export default function RecentReviews() {

  //se le pide al servidor los ultimos 3 reviews que se han hecho
  socket.emit("recent");

  //se recibe la respuesta del servidor

  function recentreview() {

    fetch("http://localhost:8080/adminrest/recentreview")
    .then(response => response.json())
    .then(response => {

    const area = document.getElementById("area");
    area.innerHTML = '';

    //funcion que crea el numero de strellas del review
    function createStarRating(stars) {
      const filledStars = '★'.repeat(stars);
      const emptyStars = '☆'.repeat(5 - stars);
      return filledStars + emptyStars;
    }
    //para cada elemento se crea un review
    response.forEach(element => {
      //se crean todos los elementos del review
      const div = document.createElement("div");
      div.classList.add("revarea");

      const div1 = document.createElement("div");
      div1.classList.add("review");

      const div2 = document.createElement("div");
      const h2 = document.createElement("h2");
      //se le pone la data al elemento indicado
      h2.textContent = element.reviewer_name;
      div2.appendChild(h2);

      const div3 = document.createElement("div");
      const h3 = document.createElement("h3");
      //usando la variable restaurants se le pone el nombre del restaurante 
      h3.textContent = element.restaurant;
      
      const span = document.createElement("span");
      //se usa la funcion de crear stars para anadir las strellas al review
      span.textContent = createStarRating(parseInt(element.stars, 10));
      
      div3.appendChild(h3);
      div3.appendChild(span);
      div2.appendChild(div3);

      const p = document.createElement("p");
      p.textContent = element.review;

      div1.appendChild(div2);
      div1.appendChild(p);
      div.appendChild(div1);

      area.appendChild(div);
    });
  });
  };

  recentreview()
  return (
    <>
      <div class="container">
        <h1>Recent Reviews</h1>
        <div class="reviews" id = "area">
        
        </div>
      </div>
    </>
  );
}
