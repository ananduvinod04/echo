import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";


// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;


console.log("TEST_ENV =", process.env.TEST_ENV);

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
