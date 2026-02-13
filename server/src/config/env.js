import dotenv from "dotenv";
dotenv.config();

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientOrigin: required("CLIENT_ORIGIN"),
  mongoUri: required("MONGO_URI"),
  paystackSecretKey: required("PAYSTACK_SECRET_KEY"),
};


