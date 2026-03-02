import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/admin.js";

async function seedAdmin() {
  await connectDB();

  const email = "admin@lagosbites.com";
  const password = "password123";

  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    password: hashed,
  });

  console.log("Admin created");
  process.exit();
}

seedAdmin();
