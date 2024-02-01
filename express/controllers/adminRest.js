const express = require("express");
const adminRest = express();

const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
client.connect();
const db = client.db("restaurant");

module.exports = adminRest;
adminRest.use(express.json());

adminRest.post("/makeReservation",async (req,res) =>{
  const newReservation = req.body.data;
  const reservations = db.collection("reservations");
  const restaurants = db.collection("restaurants");

  const restaurant = await restaurants.findOne({ name: newReservation.restaurant });

  if (!restaurant) {
    console.log("El restaurante no fue encontrado.");
    return; 
  }
  const currentCapacity = restaurant.capacity;
  if (currentCapacity != 0) {

    const count = await reservations.countDocuments();

    if(count === 0){
      await reservations.insertOne(newReservation);

      const nueva_capacidad = restaurant.capacity - 1;
      await restaurants.updateOne(
        { name: newReservation.restaurant },
        { $set: { capacity: nueva_capacidad } }
      );

      res.json({value: newReservation.reservation_number})
    } else{
      const cursor = reservations.find().sort({_id:-1}).limit(1);
      const lastReservation = await cursor.toArray();
      newReservation.reservation_number = lastReservation[0].reservation_number + 1;
      await reservations.insertOne(newReservation);

      const nueva_capacidad = restaurant.capacity - 1;
      await restaurants.updateOne(
        { name: newReservation.restaurant },
        { $set: { capacity: nueva_capacidad } }
      );

      res.json({value: newReservation.reservation_number})
    }
  }else {
    const cursor = reservations.find().sort({_id:-1}).limit(1);
    const lastReservation = await cursor.toArray();
    newReservation.reservation_number = lastReservation[0].reservation_number + 1;
    let sum = 0;
    let average = 0;
    const data = await reservations.find({restaurant: newReservation.restaurant}).toArray();
    data.forEach(element => {
      sum +=  parseInt(element.time_duration);
    });
    average = (sum /data.length);
    const t = Math.ceil(average)

    res.json({ 
      value: "000", 
      time: t,
      res: newReservation
    });
  }
});

adminRest.get("/getReservatios/:rest", async (req, res) => {
  const rest = req.params.rest;
  const reservations = db.collection("reservations");

  const cursor = reservations.find({restaurant: rest})
  const data = await cursor.toArray();

  if(!data){
    res.send([])
  }else{
    res.json(data)
  }
})

adminRest.post("/revdel",async(req) =>{
  let value = req.body.value;
  let rest = req.body.rest;
  const reservations = db.collection("reservations");
  const restaurants = db.collection("restaurants");

  const result = await reservations.deleteOne({ reservation_number: value });

  if (result.deletedCount === 1) {
    console.log(`Documento con ID ${value} eliminado exitosamente.`);

    const restaurant = await restaurants.findOne({ name: rest });

    if(!Array.isArray(restaurant.waitlist) || restaurant.waitlist.length === 0) {

      const cursor = restaurants.find({name: rest})
      const data = await cursor.toArray();
      let nueva_capacidad = data[0].capacity + 1;

      await restaurants.updateOne(
        { name: rest},
        { $set: { capacity: nueva_capacidad } }
      );
    } else {
      const currentWaitlist = restaurant.waitlist;
      const firstreservation = currentWaitlist[0];
  
      currentWaitlist.shift();
  
      await restaurants.updateOne(
        { name: rest },
        { $set: { waitlist: currentWaitlist } }
      );
      await reservations.insertOne(firstreservation);
    }
  }
})

adminRest.post("/revedit", async(req) =>{ 
  const value = req.body.data;
  const reservations = db.collection("reservations");

  const filtro = {reservation_number: parseInt(value.reservation_number)}
  const result = await reservations.updateOne(filtro, { $set: value });

  if (result.matchedCount === 1) {
    console.log(`Documento con ID ${filtro.reservation_number} actualizado exitosamente.`);
  } else {
    console.log(`No se encontró ningún documento con ID ${filtro.reservation_number}. No se realizó ninguna actualización.`);
  }
})

adminRest.post("/makereview", async (req) =>{
  const value = req.body.data;
  const reviews = db.collection("user_reviews");

  await reviews.insertOne(value);
})

adminRest.get("/getreviews/:id",async (req, res) => {
  const Id = req.params.id;
  const review = db.collection("user_reviews");

  const cursor = review.find({restaurant: Id})
  const data = await cursor.toArray();

  if(!data){
    res.send([])
  }else{
    res.json(data)
  }
})

adminRest.post("/makecomment", async (req) => {
  try {
    const commentData = req.body.data;  // Assuming commentData is an array with [comment, reservation_number]
    const review = db.collection("user_reviews");

    const filter = { _id: new ObjectId(commentData[1]) };
    const update = { $push: { comments: commentData[0] } };

    const result = await review.updateOne(filter, update);

    if (result.matchedCount === 1) {
      console.log(`Document with ID ${filter._id} updated successfully.`);
    } else {
      console.log(`No document found with ID ${filter._id}. No update performed.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

adminRest.get("/recentreview", async (req,res) => {

  const review = db.collection("user_reviews");

  const cursor = review.find().sort({_id:-1}).limit(3);
  const lastreviews = await cursor.toArray();

  res.json(lastreviews)
})

adminRest.post("/waitinglist", async (req,res) =>{
  const reservacion = req.body.data;
  const rest = req.body.rest;

  const restaurants = db.collection("restaurants");
  const restaurant = await restaurants.findOne({ name: rest });
  const currentWaitlist = restaurant.waitlist;
  if(currentWaitlist.length === 0){
    currentWaitlist.push(reservacion);
    const result = await restaurants.updateOne(
      { name: rest },
      { $set: { waitlist: currentWaitlist } }
    );

    if (result.modifiedCount === 1) {
      console.log('Waitlist updated successfully');
      res.json({ message: 'Waitlist updated successfully' });
    } else {
      console.error('Failed to update waitlist');
      res.status(500).json({ message: 'Failed to update waitlist' });
    }
  } else {
    const ultimo = currentWaitlist[currentWaitlist.length - 1];
    reservacion.reservation_number = ultimo.reservation_number + 1;
    currentWaitlist.push(reservacion);
  
    const result = await restaurants.updateOne(
      { name: rest },
      { $set: { waitlist: currentWaitlist } }
    );

    if (result.modifiedCount === 1) {
      console.log('Waitlist updated successfully');
      res.json({ message: 'Waitlist updated successfully' });
    } else {
      console.error('Failed to update waitlist');
      res.status(500).json({ message: 'Failed to update waitlist' });
    }
  }
})

adminRest.get("/getwaitinglist/:rest", async(req,res) =>{
  const rest = req.params.rest;

  const restaurants = db.collection("restaurants");
  const restaurant = await restaurants.findOne({ name: rest });

  res.json(restaurant.waitlist);
})

adminRest.post("/Login", async(req,res) =>{

  const restaurants = db.collection("restaurants");
  const users = db.collection("users");
  const value = req.body.data;
  let status;
  let indexEncontrado;

  const user = await users.findOne({ email: value.email });
  if(user.employee_num === parseInt(value.employee_num)){
    if(user.status === true){
      if (user.restaurant != 0){

        const cursor = restaurants.find();
        const rests = await cursor.toArray();

        const rest = await restaurants.findOne({ _id: user.restaurant });

        for (let i = 0; i < rests.length; i++) {
          if (rests[i].name === rest.name) {
            indexEncontrado = i;
            break; 
          }
        }
        const data = { rest: indexEncontrado, status: user.status,role: user.role,}
        res.send(data)
      } else {
        const data = {role: user.role}
        res.send(data)
      }
    }else {
      status = false
      res.send(status)
    }
  }else{
    status = false
    res.send(status)
  }
})

adminRest.post("/waitdel", async(req,res) =>{
  const value = req.body.value;
  const rest = req.body.rest;
  let foundIndex = -1;
  const restaurants = db.collection("restaurants");

  const restdata = await restaurants.findOne({ name: rest });

  restdata.waitlist.forEach((element, index) => {
    if(element.reservation_number === value){
      foundIndex = index;
    }
  });
  if (foundIndex !== -1) {
    // Utiliza $pull para eliminar el elemento del arreglo
    await restaurants.updateOne(
      { name: rest },
      { $pull: { waitlist: { reservation_number: value } } }
    );
  }
})