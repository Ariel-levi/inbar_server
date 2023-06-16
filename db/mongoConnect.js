const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);
  console.log("Mongo Connected... (Inbar Project)");
}
