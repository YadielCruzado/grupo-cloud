const {readFrom, writeTo, decode, decodeMessage} = require("../src/tools");
const cors = require("cors");
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } })

let Message = 0;
let estado = false;

io.on('connection', (socket) => {
  console.log(`user: ${socket.id} connected`);

  //socket para crear una reservacion
  socket.on("mreservation", (value) => {
    value = decode(value);
    MakeReservation(value);
  });

  //socket para crear obtener las reservaciones hechas
  socket.on("gReservations", (value) => {
    value = getReservation(value);
    socket.emit('Reservations', value);
  });

  //socket para eliminar una reservacion
  socket.on("deleteres", (value) => {
    deleter(value);
  });

  //socket para editar una reservacion
  socket.on("editreservation", (value) => {
    value = decode(value);
    editreservation(value);
  });

  //socket para obtener los reviews recientes
  socket.on("recent", () => {
    socket.emit('getRecent', recentreview());
  });

  //socket para editar una reservacion
  socket.on("reviews", (value) => {
    value = decode(value);
    socket.emit('getreviews', reviews(value));
  });

  //socket para crear un comentario al review
  socket.on("mcomment", (value) => {
    value = decode(value);
    makecomment(value)
  });

  //socket que devuelve un contador
  socket.on("contador", () => {
    const cont = contador();
    socket.emit('contador', (cont));
  });

  //socket para manejar el login
  socket.on("login", (value) => {
     // llamamos funcion decode
    value = decode(value);
    Login(value, (result) => {
        if (result !== null) {
            console.log("data to emit", result);
            socket.emit("login", JSON.stringify(result));
        } else {
            console.error("Error during login processing");
        }
    });
  });


  socket.on("comment", (value) => {
     // llamamos funcion decode
    value = decode(value); 
    comments(value, (result) => {
      if (result !== null) {
        console.log("data to emit", result);
        socket.emit("comment", JSON.stringify(result));
      } else {
        console.error("Error during login processing");
      }
    });
  });

});

http.listen(3000, () => {console.log('Server is running on port 3000');});

//funcion para crear reservaciones
function MakeReservation(newReservation) {
  const filePath = `./reservations.json`;
  //de la funcion readfrom de obtiene las reservacionesque esta en el archivo de reservaciones.
  let reservationsData = readFrom(filePath)

  //si el json esta vacio se inseta lo nuevo
  if(Object.keys(reservationsData).length === 0){
    //se crea la user reviews y el contador
    reservationsData = { reservaciones: {},contador: {} };
    //se inserta la data nueva en la primera posicion 
    reservationsData.reservaciones['1'] = newReservation;
    //se actualiza el contador
    reservationsData.contador["contador"] = 1;
    const jsonData = JSON.stringify(reservationsData, null, 2);
    //se anade la data el file 
    writeTo(filePath , jsonData);
  } else {
    //se obtiene el contador del archivo que se utilizara como key
    const key = reservationsData.contador.contador;
    const newKey = (key).toString();
    //se inserta la nueva reservacion en la poscicion del contador/key
    reservationsData.reservaciones[newKey] = newReservation;
    //se le da un numero de reservacion
    reservationsData.reservaciones[newKey].resNum = key;
    //el contador es aumentado en 1
    reservationsData.contador.contador = reservationsData.contador.contador + 1;
    const updatedData = JSON.stringify(reservationsData, null, 2);
    //la data es escrita denuevo en el archivo
    writeTo(filePath , updatedData);
  }
}

//funcion que obtiene las reservaciones dependiendo del id del restaurante
function getReservation(id) {
  const filePath = `./reservations.json`;
  //de la funcion readfrom de obtiene las reservacionesque esta en el archivo de reservaciones.
  const reservationsData = readFrom(filePath)

  if (!reservationsData) {
    return ([])
  }else {
    //se filtran las reservaciones que tengan el id de restaurante indicado
    const filteredReservations = Object.values(reservationsData.reservaciones).filter((reservation) => reservation.restaurant === id);
    return JSON.stringify(filteredReservations);
  }
}

//funcion que elimina la reservacion de el json
function deleter(value){
  const filePath = `./reservations.json`;
  //la funcion readfrom de obtiene las reservacionesque esta en el archivo de reservaciones.
  const reservaciones = readFrom(filePath)

  //si la reservacion seleccionada existe es eliminada 
  if (reservaciones.reservaciones[value]) {
    delete reservaciones.reservaciones[value];
    const updatedData = JSON.stringify(reservaciones, null, 2);
    //se le da update a la data sin la reservacion eliminada
    writeTo(filePath , updatedData);
  }
}

//funcion para editar una reservacion indicada
function editreservation(value) {
  const filePath = `./reservations.json`;
  //la funcion readfrom de obtiene las reservacionesque esta en el archivo de reservaciones.
  const reservaciones = readFrom(filePath)

  //si la reservacion existe se actualizar los valores de la reserva existente
  if (reservaciones && reservaciones.reservaciones && reservaciones.reservaciones[value.resNum]) {

    reservaciones.reservaciones[value.resNum].nombre = value.nombre;
    reservaciones.reservaciones[value.resNum].cantidad_personas = value.cantidad_personas;
    reservaciones.reservaciones[value.resNum].fecha = value.fecha;
    reservaciones.reservaciones[value.resNum].hora = value.hora;
    reservaciones.reservaciones[value.resNum].restaurant = value.restaurant;
    reservaciones.reservaciones[value.resNum].email = value.email;

    writeTo(filePath , JSON.stringify(reservaciones));
  }
}

//funcion que obtiene las ultimas 3 reviews hechas
function recentreview() {
  const filePath = './reviews.json';
  //la funcion readfrom de obtiene las reviews que esta en el archivo de reviews.
  const data = readFrom(filePath);
  
  //si el archivo tiene dara se obtienen las ultimas 3 y se devuelven
  if (data.user_review && typeof data.user_review === 'object') {
    const reviewsArray = Object.values(data.user_review);
    //con slice(-3) se obtienen las ultimas 3
    const lastThreeReviews = reviewsArray.slice(-3);

    return lastThreeReviews;
    //si no hay reviews se devuelve un array vacio
  } else {
    return ([]);
  }
}

//obtiene los reviews de el restaurante indicado
function reviews(id) {
  const filePath = './reviews.json';
  //la funcion readfrom de obtiene las reviews que esta en el archivo de reviews.
  const data = readFrom(filePath);
  //dependiendo del id del restaurante de filtran los reviews 
  const resenias =  Object.values(data.user_review).filter(review => parseInt(review.rest_id) === id);
  return resenias
}

//funcion para cuando el admin hace un comentario a los reviews
function makecomment(comment) {
  const filePath = './reviews.json';
  //la funcion readfrom de obtiene loes reviews esta en el archivo de reviews.
  const data = readFrom(filePath);
  
  //se anade el comentario del admin al arreglo
  if (data.user_review[comment[1]]){
    data.user_review[comment[1]].coments.push(comment[0]);
  }
  const updatedData = JSON.stringify(data, null, 2);
  //se actualiza el json
  writeTo(filePath , updatedData);
}

//funcion para que los usuarios dejen un review
function  comments(value) {
  const filePath = `./reviews.json`;
  //la funcion readfrom de obtiene la data del archivo de reviews
  let data = readFrom(filePath);
  //si el json esta vacio de crea la data y se inseta lo nuevo
  if (Object.keys(data).length === 0){
    //se crea la user reviews y el contador
    data = { user_review: {},contador: {} };
    const newdata ={
      "reviewer_n": value.name,
      "rest_id": value.id,
      "review": value.comment,
      "stars": value.rating,
      "coments": [],
      "revNum": 1
    }
    //se inserta la data nueva en la primera posicion 
    data.user_review['1'] = newdata;
    //se actualiza el contador
    data.contador["contador"] = 2;
    
    //se anade la data el file
    writeTo(filePath , data);
  }else{
    //se obtiene el contador de este archivo
    const contador = data.contador.contador;
    //se obtiene la data del front y se organiza como es guardada en el json
    const newdata ={
      "reviewer_n": value.name,
      "rest_id": value.id,
      "review": value.comment,
      "stars": value.rating,
      "coments": [],
      "revNum": contador
    }
    //en la posicion del key sera guardada la data
    data.user_review[contador] = newdata;
    //el contador se actualiza
    data.contador.contador = data.contador.contador + 1;
    
    //se escribe la data denuevo en el json
    writeTo(filePath , data);
  }
}

// Function for login
function Login(value, callback) {
  const fs = require('fs');
  const filePath = `./users.json`;

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(null);
      return;
    }
    try {
      const jdata = JSON.parse(fileData);
      let exist = false;

      jdata.userDB.forEach((user) => {
        if (user.email == value.email && user.employee_num == value.employee_num) {
          exist = true;
          estado = user.estado;
          id = user.restaurant;
        }
      });
      if (exist) {
        Message = {
          estado ,
          id
        }
        callback(Message);
      } else {
         Message = {
          estado : "failed",
        }
         callback(Message);
      }
    } catch (err) {
      callback(null);
    }
  });
}

//funcion que devuelve el contador de las reservaciones para el invoice
function contador(){

  const filePath = `./reservations.json`;
  //la funcion readfrom de obtiene las reservacionesque esta en el archivo de reservaciones.
  const reservationsData = readFrom(filePath)
  //se obtiene el contador
  const contador = reservationsData.contador.contador;
  //se devuelve el contador
  return contador;
}
