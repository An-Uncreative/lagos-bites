import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.js";
import { signToken } from "../utils/jwt.js";

export async function loginAdmin(req, res) {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    id: admin._id,
    role: admin.role,
  });

  return res.json({
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
}
