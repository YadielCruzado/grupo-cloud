import Restaurants from "../components/restaurants";
import RecentReviews from "../components/ResentReviews";
import "../css/restaurant.css";

export default function index() {
  return (
    <>
      <body>
        <header
          style={{ backgroundImage: `url(${require("../images/back5.jpg")})` }}
        >
          <h1>Restaurant Reservation System</h1>
        </header>
      </body>
      <Restaurants />
      <RecentReviews />
    </>
  );
}
