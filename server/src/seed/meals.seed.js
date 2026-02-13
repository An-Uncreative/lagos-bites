import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Meal } from "../models/Meal.js";

const meals = [
  {
    name: "Smoky Jollof Rice",
    category: "Rice",
    price: 3500,
    desc: "Smoky party-style jollof served hot.",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc500f",
  },
  {
    name: "Chicken Fried Rice",
    category: "Rice",
    price: 3800,
    desc: "Veg fried rice with tender chicken.",
    imageUrl: "https://images.unsplash.com/photo-1604909053191-9f60b6f73b5c",
  },
  {
    name: "Beef Suya Wrap",
    category: "Grills",
    price: 3200,
    desc: "Spicy suya with fresh veggies.",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
  {
    name: "Chicken Shawarma",
    category: "Wraps",
    price: 3000,
    desc: "Classic shawarma with creamy sauce.",
    imageUrl: "https://images.unsplash.com/photo-1521305916504-4a1121188589",
  },
  {
    name: "Yam Porridge (Asaro)",
    category: "Local",
    price: 3400,
    desc: "Rich, peppery yam porridge.",
    imageUrl: "https://images.unsplash.com/photo-1604908177453-7462950d7b93",
  },
  {
    name: "Zobo (500ml)",
    category: "Drinks",
    price: 800,
    desc: "Chilled zobo with pineapple twist.",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
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
