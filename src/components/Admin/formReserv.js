import React, { useState, useEffect } from "react";
import { restaurants } from "../restaurants";

export default function FormReserv() {
  const index = localStorage.getItem("selectedRestaurantIndex");
  const restaurant = restaurants[index];
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contador, setContador] = useState("");
  const [Time, setTime] = useState("");
  const [resinfo, setresinfo] = useState("");
  const [minDate, setMinDate] = useState("");
  const [selectedHours, setSelectedHours] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
  let reservationinfo;

  useEffect(() => {
    // Set today's date as the minimum date
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  function disableHour(hour) {
    setSelectedHours([...selectedHours, hour]);
  }
  function makeReservation(e) {
    e.preventDefault();
    const nombreValue = document.getElementById("nombre").value;
    const personas = document.getElementById("cantidad_personas").value;
    const hour = document.getElementById("hora").value;
    const emailValue = document.getElementById("email").value;
    const duration = document.getElementById("duration").value;
    //validacion de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      //flag de la pagina para email invalidos
      alert("Porfavor Introduce un email valido!.");
      return;
    }

    disableHour(hour); // quitar la hora seleccionada
    const data = {
      reservation_number: 1,
      name: nombreValue,
      group_size: personas,
      date: minDate,
      time: hour,
      restaurant: restaurant.name,
      email: emailValue,
      time_duration: duration,
    };

    fetch("http://localhost:8080/adminrest/makeReservation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
      }),
    })
      .then((response) => response.json()) // Parse the JSON in the response
      .then((data) => {
        if (data.value === "000") {
          setTime(data.time);
          setresinfo(data.res);
          openModal();
        } else {
          setContador(data.value);
          setNombre(nombreValue);
          setEmail(emailValue);
          showInvoice();
        }
      });
  }

  function showInvoice() {
    setShowInvoiceModal(true);
  }

  function handleCloseInvoiceModal() {
    setShowInvoiceModal(false);
    window.location.reload();
  }

  const availableHours = ["08:00", "10:00", "12:00", "14:00", "16:00"].filter(
    (hour) => !selectedHours.includes(hour)
  );

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    window.location.reload();
  }

  const handleSelectChange = (event) => {
    // Actualiza el estado cuando cambia la opción seleccionada
    setOpcionSeleccionada(event.target.value);
  };

  const waitinglist = (event) => {
    closeModal();
    event.preventDefault();

    if (opcionSeleccionada === "yes") {
      console.log(resinfo);

      fetch("http://localhost:8080/adminrest/waitinglist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: resinfo,
          rest: restaurant.name,
          average: Time,
        }),
      });
    } else {
      closeModal();
    }
  };

  return (
    <>
      <div class="RWforms">
        <section class="reservForm">
          <h1>Reservation Form</h1>
          <form onSubmit={makeReservation}>
            <label for="nombre">Name:</label>
            <input type="text" id="nombre" name="nombre" required />
            <br />
            <br />

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" />
            <br />
            <br />

            <label for="cantidad_personas">Number of Persons:</label>
            <input
              type="number"
              id="cantidad_personas"
              name="cantidad_personas"
              required
              min="1"
              max="10"
            />
            <br />
            <br />

            <label for="duration">Duration:</label>
            <input
              type="number"
              id="duration"
              name="duration"
              required
              min="1"
              max="5"
            />
            <br />
            <br />

            <label for="hora">Time:</label>
            <select id="hora" name="hora" required>
              {availableHours.map((hour) => {
                const [hourValue, minuteValue] = hour.split(":");
                let displayHour = parseInt(hourValue);
                let label = displayHour >= 12 ? "PM" : "AM";

                if (displayHour === 0) {
                  displayHour = 12;
                } else if (displayHour > 12) {
                  displayHour -= 12;
                }

                const displayTime = `${displayHour}:${minuteValue} ${label}`;

                return (
                  <option key={hour} value={hour}>
                    {displayTime}
                  </option>
                );
              })}
            </select>

            <br />
            <br />

            <input
              type="hidden"
              name="restaurant"
              id="restaurant"
              value="1"
              // defaultValue={restaurant} //value of the restaurant variable, based on selectedRestaurantIndex stored in local storage
            />

            <button type="submit" id="submit" class="btn">
              Submit
            </button>
          </form>
        </section>
      </div>

      {/* Invoice Modal */}
      <div
        className={`modal ${showInvoiceModal ? "show" : ""}`}
        style={{ display: showInvoiceModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header y">
              <h1>Reservation Invoice</h1>
              <button
                type="button"
                className="close"
                onClick={handleCloseInvoiceModal}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <section className="invoice">
                <div className="invoice-header">
                  <h2>Reservation Details</h2>
                </div>
                <div className="invoice-details">
                  <p>
                    <strong>Name:</strong> {nombre}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Numero de reservacion:</strong> {contador}
                  </p>
                </div>
                <div className="invoice-footer">
                  <p>
                    <strong>Reservacion hecha la recibira por email!!</strong>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <div
        className={`modal ${ShowModal ? "show" : ""}`}
        style={{ display: ShowModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header y">
              <h1>Do you want to be added to the waiting list</h1>
              <button type="button" className="close" onClick={closeModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <section className="invoice">
                <h2>The estimated time is {Time} minutes</h2>
                <form onSubmit={waitinglist}>
                  <select
                    id="opcion"
                    value={opcionSeleccionada}
                    onChange={handleSelectChange}
                  >
                    <option selected value=""></option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  <button type="submit" id="submit" class="btn">
                    Submit
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
