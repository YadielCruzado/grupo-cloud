import { restaurants } from "./restaurants";

export default function AdminReviews() {
  //se obtiene el index del arreglo para cargar la informacion del restaurante
  const index = localStorage.getItem("selectedRestaurantIndex");
  const restaurant = restaurants[index];

  //se recibe la respuesta del servidor
  function getreviews() {
    fetch("http://localhost:8080/adminrest/getreviews/" + restaurant.name)
      .then((response) => response.json())
      .then((response) => {

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
          h3.textContent = restaurant.name;

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

          const comdiv = document.createElement("div");
          comdiv.classList.add("coment");
          const comh3 = document.createElement("h3");
          comh3.textContent = "Leave a coment";
          comdiv.appendChild(comh3);

          const comform = document.createElement("form");
          const commessage = document.createElement("textarea");
          commessage.id = "commessage" + element._id;
          const comsubmit = document.createElement("input");
          comsubmit.type = "submit";
          comsubmit.id = "comsubmit" + element._id;
          const comhidden = document.createElement("input");
          comhidden.type = "hidden";
          comhidden.id = "comhidden" + element._id;
          comhidden.value = element._id;

          comsubmit.addEventListener("click", function () {
            const message = document.getElementById(
              "commessage" + element._id
            ).value;
            const hid = document.getElementById(
              "comhidden" + element._id
            ).value;

            const data = [message, hid];

            fetch("http://localhost:8080/adminrest/makecomment", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: data,
              }),
            });
          });

          comform.appendChild(commessage);
          comform.appendChild(comhidden);
          comform.appendChild(comsubmit);
          comdiv.appendChild(comform);

          div1.appendChild(div2);
          div1.appendChild(p);
          div1.appendChild(comdiv);
          div.appendChild(div1);

          area.appendChild(div);
        });
      });
  }

  getreviews();

  return (
    <>
      <div class="container">
        <h1>{restaurant.name} Reviews</h1>
        <div class="reviews" id="area"></div>
      </div>
    </>
  );
}
