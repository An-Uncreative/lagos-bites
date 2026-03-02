import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Meal } from "../models/meal.js";

const meals = [
  {
    name: "Smoky Jollof Rice",
    category: "Rice",
    price: 3500,
    desc: "Smoky party-style jollof served hot.",
    imageUrl: "/images/Jollof-Rice-02.jpg",
  },
  {
    name: "Chicken Fried Rice",
    category: "Rice",
    price: 3800,
    desc: "Veg fried rice with tender chicken.",
    imageUrl: "/images/chicken_fried_rice.jpg",
  },
  {
    name: "Beef Suya",
    category: "Grills",
    price: 3200,
    desc: "Spicy suya with fresh veggies.",
    imageUrl: "/images/Suya.jpg",
  },
  {
    name: "Chicken Shawarma",
    category: "Wraps",
    price: 3000,
    desc: "Classic shawarma with creamy sauce.",
    imageUrl: "/images/chicken_shawarma.jpg",
  },
  {
    name: "Yam Porridge (Asaro)",
    category: "Local",
    price: 3400,
    desc: "Rich, peppery yam porridge.",
    imageUrl: "/images/yam_porridge_asaro.jpg",
  },
  {
    name: "Zobo (500ml)",
    category: "Drinks",
    price: 800,
    desc: "Chilled zobo with pineapple twist.",
    imageUrl: "/images/zobo_drink.jpg",
  },
];

async function run() {
  await mongoose.connect(env.mongoUri);

  // idempotent seed: clear then insert
  await Meal.deleteMany({});
  await Meal.insertMany(meals);

  console.log(`✅ Seeded ${meals.length} meals`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
