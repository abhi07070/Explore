const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

//@Database Connection
const mongoDBURL = process.env.MONGODB_URL;
mongoose.connect(mongoDBURL);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

//@Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
