import mongoose from "mongoose";
import dotenv from "dotenv";

// Read environment variables
const dotenvResult = dotenv.config({ path: '.env' });
if (dotenvResult.error) {
  console.log("ERROR when loading .env",dotenvResult.error);
  process.exit(1);
}

// NOTE: These values SHOULD be coming from .env!
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const db = "bloggyboi";

const connectionString = `mongodb://${username}:${password}@localhost:27017/${db}`;

mongoose.connection.on("error", (e) => console.log(">> Error!", e) || process.exit(0));
mongoose.connection.on("connecting", () => console.log(">> Connecting"));
mongoose.connection.on("disconnecting", () => console.log(">> Disconnecting"));
mongoose.connection.on("disconnected", () => console.log(">> Disconnected"));

export default class Database {
  async connect() {
    return await mongoose.connect(connectionString);
  }
}
