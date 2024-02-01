import FormReserv from "../components/Admin/formReserv";
import { restaurants } from "../components/restaurants";
import AdminReviews from "../components/Adminreviews";
import React, { useState } from "react";
import waitlist from "../components/waitinglist";


export default function AdminRest() {
  //se obtiene el index del arreglo para cargar la informacion del restaurante
  const index = localStorage.getItem("selectedRestaurantIndex");
  const restaurant = restaurants[index];

  //funciones utilizadas para mostrar el pop up al editar una reservacion
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //funcion que crea la tabla de reservaciones hechas
  function checkReservationsResult() {
    fetch("http://localhost:8080/adminrest/getReservatios/" + restaurant.name)
      .then((response) => response.json())
      .then((result) => {
        //seleciona en el codigo donde se pondran las tablas y limpia el area
        const body = document.getElementById("tbody");
        body.innerHTML = "";

        //a cada elemento se le crea un row en la tabla
        result.forEach((element, index) => {
          //se crea el row
          const row = document.createElement("tr");

          //funcion que crea las celdas donde se pondra la informacion
          const createCell = (value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            return cell;
          };
          //funcion que crea los botones con sus respectivas clases
          const createButton = (title, iconClass) => {
            const button = document.createElement("button");
            button.className = "btn btn-sm rounded-0";
            button.type = "button";
            button.setAttribute("data-toggle", "tooltip");
            button.setAttribute("data-placement", "top");
            button.setAttribute("title", title);

            const icon = document.createElement("i");
            icon.className = iconClass;

            button.appendChild(icon);

            return button;
          };

          const td = document.createElement("td");
          const ul = document.createElement("ul");
          ul.className = "list-inline m-0";

          //se crea el boton de delete
          //se crea el event listener para poder eliminar la data en el servidort con
          const deletebutton = createButton("Delete", "fa fa-trash");
          deletebutton.addEventListener("click", function () {
            fetch("http://localhost:8080/adminrest/revdel", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                value: element.reservation_number,
                rest: element.restaurant
              }),
            });

            window.location.reload();
          });

          //se crea el boton de edit
          //se crea el event listener para poder editar la reservacion
          const editbutton = createButton("Edit", "fa fa-edit");
          editbutton.addEventListener("click", function () {
            const nombre = document.getElementById("name");
            const personas = document.getElementById("people");
            const fecha = document.getElementById("date");
            const hour = document.getElementById("hour");
            const email = document.getElementById("mail");
            const rest = document.getElementById("res");
            const number = document.getElementById("reservationNumber");
            const duration = document.getElementById("dur");
            //obtiene la informacion y se pone en donde debe estar para ser editada
            nombre.value = element.name;
            email.value = element.email;
            personas.value = element.group_size;
            fecha.value = element.date;
            hour.value = element.time;
            rest.value = element.restaurant;
            number.value = element.reservation_number;
            duration.value = element.time_duration;
            //llama el popup de edicion
            handleShowModal();
          });

          //le anade los botones a la tabla
          ul.appendChild(deletebutton);
          ul.appendChild(editbutton);
          td.appendChild(ul);

          //se crean las celdas de la tabla con la informacion
          const cells = [
            element.reservation_number,
            element.name,
            element.group_size,
            element.date,
            element.time,
            element.time_duration,
          ].map(createCell);

          //se anaden los botones a las celdas
          //se anade las celdas a la tabla
          cells.push(td);
          cells.forEach((cell) => row.appendChild(cell));
          body.appendChild(row);
        });
      });
  }

  //funcion para hacer update a la informacion de la reservacion
  function updateReservation() {
    const nombre = document.getElementById("name").value;
    const personas = document.getElementById("people").value;
    const fecha = document.getElementById("date").value;
    const hour = document.getElementById("hour").value;
    const rest = document.getElementById("res").value;
    const email = document.getElementById("mail").value;
    const number = document.getElementById("reservationNumber").value;

    const duration = document.getElementById("dur").value;

    //se pone la data en un json y se envia al backend para ser procesada
    const data = {
      reservation_number: number,
      name: nombre,
      group_size: personas,
      date: fecha,
      time: hour,
      restaurant: rest,
      email: email,
      time_duration: duration,
    };

    fetch("http://localhost:8080/adminrest/revedit", {
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

  function list() {
    fetch("http://localhost:8080/adminrest/getwaitinglist/"+ restaurant.name)
    .then(response => response.json())
    .then(result => {
      console.log(result)
        
      const body = document.getElementById("waitbody");
      body.innerHTML = "";

      result.forEach((element) => {
        const row = document.createElement("tr");

        const createCell = (value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          return cell;
        }

        const td = document.createElement("td");
        const ul = document.createElement("ul");
        ul.className = "list-inline m-0";

        const createButton = (title, iconClass) => {
          const button = document.createElement("button");
          button.className = "btn btn-sm rounded-0";
          button.type = "button";
          button.setAttribute("data-toggle", "tooltip");
          button.setAttribute("data-placement", "top");
          button.setAttribute("title", title);

          const icon = document.createElement("i");
          icon.className = iconClass;

          button.appendChild(icon);

          return button;
        };

        const deletebutton = createButton("Delete", "fa fa-trash");
          deletebutton.addEventListener("click", function () {
            fetch("http://localhost:8080/adminrest/waitdel", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                value: element.reservation_number,
                rest: element.restaurant
              }),
            });

            window.location.reload();
          });

          ul.appendChild(deletebutton);
          td.appendChild(ul);

        const cells = [
          element.reservation_number,
          element.name,
          element.group_size,
          element.time_duration,
        ].map(createCell);

        cells.push(td);
        cells.forEach((cell) => row.appendChild(cell));
        body.appendChild(row);
      });
    });
  }

  //funcion que llama a todas las reservaciones
  list()
  checkReservationsResult();

  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Administrator - Restaurant</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous" />
        <link rel="stylesheet" href="admin.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Delius&family=Love+Ya+Like+A+Sister&family=Marck+Script&family=Sriracha&display=swap"
          rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </head>
      <header>
        <h1>Administrator Page: {restaurant.name}</h1>
      </header>
      <div class="row reservform">
        <div class="col-md-6">
          <FormReserv />
        </div>

        <div class="col-md-6 reserv-table">
          <h1>Reservation List</h1>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col"># of Reserv.</th>
                <th scope="col">Name</th>
                <th scope="col">Persons</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Duration</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
      </div>
      <section>
      <div class="container">
        <h1>{restaurant.name}  waitinglist</h1>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">reservation number</th>
              <th scope="col">Name</th>
              <th scope="col">group of people</th>
              <th scope="col">estimated time</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody id="waitbody">

          </tbody>
        </table>
      </div>
      </section>
      <AdminReviews />
      <div>
        <div
          className={`modal ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header y">
                <h1>Edit Reservation</h1>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <section class="reservForm formyadiel">
                  <form onSubmit={updateReservation}>
                    <label for="nombre">Name:</label>
                    <input type="text" id="name" name="nombre" required />
                    <br />
                    <br />

                    <label for="email">Email:</label>
                    <input type="text" id="mail" name="email" />
                    <br />
                    <br />

                    <label for="cantidad_personas">Number of Persons:</label>
                    <input
                      type="number"
                      id="people"
                      name="cantidad_personas"
                      required />
                    <br />
                    <br />

                    <label for="duration">Tiempo en el restaurante</label>
                    <input type="number" id="dur" name="duration" required />
                    <br />
                    <br />

                    <input type="hidden" id="date" name="fecha" required />


                    <label for="hora">Time:</label>
                    <select id="hour" name="hora" required>
                      <option value="08:00">08:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                    <br />
                    <br />

                    <input type="hidden" name="restaurant" id="res" />
                    <input
                      type="hidden"
                      name="restaurant"
                      id="reservationNumber" />

                    <button type="submit" id="submit" class="btn">
                      Submit
                    </button>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
