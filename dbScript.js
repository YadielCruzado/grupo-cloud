const { query } = require("express");
const mongo = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";

const collectionsNames = [
  "reservations",
  "restaurants",
  "user_reviews",
  "users",
];

let queryRun = false;

const data = {
  restaurants: [
    {
      name: "Applebees",
      image: "applebees.png",
      info: "Bill and TJ Palmer opened the restaurant that would later become Applebee's. We've grown up a lot since then, with almost 2,000 locations in the U.S. and around the world. Here you will always be welcome - for delicious food, in a neighborhood setting, with attentive service, at a great value.",
      menu: {
        appetizers: [
          "Boneless Wings",
          "Doble Crunch Bone-In Wings",
          "Mozzarella Sticks",
          "Crispy Cheese Bites",
        ],
        main_course: [
          "Riblets Platter",
          "Doble-Glazed Baby Back Ribs",
          "8 OZ Top Sirloin",
          "6 OZ Top Sirloin",
          "12 OZ Ribeye",
        ],
        desserts: [
          "Triple Chocolate MeltDown",
          "Cinnabon Mini Swirls",
          "Brownie Bite",
          "Sugar Dusted Donut Dippers",
        ],
        beverges: [
          "Fountain Drinks",
          "Iced Tea",
          "Fruid Flavored Iced Tea",
          "Oreo Cookie Shake",
        ],
      },
      capacity: 100,
      opening_hour: 11,
      closing_hour: 22,
      "waitlist": []
    },
    {
      name: "Chilis",
      image: "chilis.png",
      info: "Chili's is everyone's favorite for being the best to go with children, having the best dessert and the best drinks and cocktails as we were called by the Sal! Awards 2011-2014. Chili's offers a fun atmosphere in a distinctive and energetic atmosphere.",
      menu: {
        appetizers: [
          "Dip Trio",
          "Signature Wings",
          "Mozzarella Cheese Sticks",
          "Loaded Boneless Wings",
        ],
        main_course: [
          "Baby Back Ribs",
          "Half Rack Baby Back Ribs",
          "Parmesan Crusted Sirloin",
          "Churrasco",
        ],
        desserts: [
          "Molten Chocolate Cake",
          "Mini Molten",
          "Cheesecake",
          "Chocolate Chips Skillet",
        ],
        beverges: [
          "Passion Fruit Margarita",
          "Passion Refresher",
          "Bacardi Mojito",
          "Dewars Coco",
        ],
      },
      capacity: 100,
      opening_hour: 11,
      closing_hour: 22,
      "waitlist": []
    },
    {
      name: "Olive Gardens",
      image: "olive.png",
      info: "At Olive Garden, we know that life is better together and everyone is happiest when they're with family. From never ending servings of our freshly baked breadsticks and iconic garden salad, to our homemade soups and sauces, there's something for everyone to enjoy.",
      menu: {
        appetizers: ["Toasted Pork", "Fried Mozzarella", "Chicken Fingers"],
        main_course: [
          "Fettuccine Alfredo",
          "Cheese Ravioli",
          "Spaghetti with Marinara",
        ],
        desserts: ["Tiramisu", "Sicilian Cheesecake"],
        beverges: [
          "Bellini-Peach Raspberry Iced Tea",
          "Fresh Brewed Iced Tea",
          "Raspberry Lemonade",
        ],
      },
      capacity: 100,
      opening_hour: 11,
      closing_hour: 22,
      "waitlist": []
    },
    {
      name: "Sizzler",
      image: "sizzler.png",
      info: "Everyone could enjoy a great steak dinner at an affordable price.",
      menu: {
        appetizers: [],
        main_course: [
          "Steak & Jumbo Crispy Shrimp",
          "Steak & Italian Herb Chicken",
          "Fresh Grilled Salmon",
          "Cilantro Lime Barramundi",
        ],
        desserts: ["Triple Chocolate Cake", "Carrot Cake"],
        beverges: ["Fountain drink"],
      },
      capacity: 100,
      opening_hour: 11,
      closing_hour: 20,
      "waitlist": []
    },
    {
      name: "Ponderosa",
      image: "ponderosa.png",
      info: "Ponderosa Steakhouse is well known for its extensive menu selection of steaks, chicken and fish entrees. All Entrees include 'All You Care To Eat” Buffet'",
      menu: {
        appetizers: [
          "Garden Salad",
          "Chicken Wings",
          "Baked Chicken",
          "Beef Tacos",
        ],
        main_course: [
          "Center Cut Sirloin",
          "Ribeye Steak",
          "Signature Sirloin Tips",
          "Chopped Steak",
        ],
        desserts: [
          "Bread Pudding",
          "Cheesecake",
          "Peanut Butter Fudge",
          "apple Cobber",
        ],
        beverges: ["Fountain Drinks"],
      },
      capacity: 100,
      opening_hour: 11,
      closing_hour: 21,
      "waitlist": []
    },
  ],
  reservations: [],
  user_reviews: [],
  users: [
    {
      employee_num: 0,
      email: "owner@example.com",
      status: true,
      restaurant: "0",
      role: "owner",
    },
  ],
};

const extraUsers = [
  {
    employee_num: 1,
    email: "applebeesAdmin@gmail.com",
    status: true,
    restaurant: "Applebees",
    role: "admin",
  },
  {
    employee_num: 2,
    email: "applebees@gmail.com",
    status: true,
    restaurant: "Applebees",
    role: "employee",
  },
  {
    employee_num: 3,
    email: "chilisAdmin@gmail.com",
    status: true,
    restaurant: "Chilis",
    role: "admin",
  },
  {
    employee_num: 4,
    email: "chilis@gmail.com",
    status: true,
    restaurant: "Chilis",
    role: "employee",
  },
  {
    employee_num: 5,
    email: "olivegardenAdmin@gmail.com",
    status: true,
    restaurant: "Olive Gardens",
    role: "admin",
  },
  {
    employee_num: 6,
    email: "olivegarden@gmail.com",
    status: true,
    restaurant: "Olive Gardens",
    role: "employee",
  },
  {
    employee_num: 7,
    email: "sizzlerAdmin@gmail.com",
    status: true,
    restaurant: "Sizzler",
    role: "admin",
  },
  {
    employee_num:8,
    email: "sizzler@gmail.com",
    status: true,
    restaurant: "Sizzler",
    role: "employee",
  },
  {
    employee_num: 9,
    email: "ponderosaAdmin@gmail.com",
    status: true,
    restaurant: "Ponderosa",
    role: "admin",
  },
  {
    employee_num: 10,
    email: "ponderosa@gmail.com",
    status: true,
    restaurant: "Ponderosa",
    role: "employee",
  },
];

function getNames(collections) {
  const names = [];

  for (let x of collections) {
    names.push(x.name);
  }
  console.log(names);
  return names;
}

async function createDatabase(client = new mongo.MongoClient(uri)) {
  try {
    await client.connect();
    const db = client.db("restaurant");
    const collections = await db.listCollections().toArray();

    const names = getNames(collections);

    for (let name of collectionsNames) {
      if (!names.includes(name)) {
        if (data[name].length > 0) {
          console.log("Collection with data");
          await db.createCollection(name);
          await db.collection(name).insertMany(data[name]);
        } else {
          console.log("Collection");
          await db.createCollection(name);
        }
      }
    }
  } finally {
    await client.close();
  }
}

async function insertNewUsers(users, client = new mongo.MongoClient(uri)) {
  try {
    await client.connect();
    const db = client.db("restaurant");
    for (user of users) {
      let result = await db
        .collection("restaurants")
        .findOne({ name: user.restaurant });

      while (result == null) {
        result = await db
          .collection("restaurants")
          .findOne({ name: user.restaurant });
      }

      //console.log(result["_id"].toString());
      user.restaurant = result["_id"];

      await db.collection("users").insertOne(user);
    }
  } finally {
    await client.close();
  }
}

createDatabase();
insertNewUsers(extraUsers);
