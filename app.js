const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

const userRouter = require("./router/userrouter");
const ProductRouter = require("./router/productRouter");
const BlogRouter = require("./router/blogRouter");
const AdminRouter = require("./router/adminRoter");



const app = express();

// MongoDB URL
const url_path =
  "mongodb+srv://akashprajapati99089908_db_user:18zf3isabnJBIKyq@ddd.begsczw.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ddd";

// Parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (before routes!)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Sessions (before routes!)
const store = new MongoDBStore({
  uri: url_path,
  collection: "sessions",
});

app.use(
  session({
    secret: "e-commerce-secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false },
  })
);

// MULTER (before product router)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.use(upload.single("image")); // apply file upload middleware

// ROUTES (must be last)
app.use(userRouter);
app.use(ProductRouter); // ✔ session now works here
app.use(BlogRouter);
app.use(AdminRouter);
mongoose
  .connect(url_path)
  .then(() => {
    console.log("Mongo connected");
    app.listen(3001, () =>
      console.log("Server running at http://localhost:3001")
    );
  })
  .catch((err) => console.log("Mongo DB error", err));
