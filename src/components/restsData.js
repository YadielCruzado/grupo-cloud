import { useState } from "react";

export default function GetData() {
  const [rests, setRests] = useState([]);
  fetch("http://localhost:8080/restaurant/allRestaurants")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setRests(data.data);
    });
  return JSON.stringify(rests);
}
