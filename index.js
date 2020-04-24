const express = require("express");
const path = require("path");
const csrf = require('csurf');
const flash =require('connect-flash')
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const authRoutes = require("./routes/auth");
const ordersRouts = require("./routes/orders");
const coursesRoutes = require("./routes/courses");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const MONGODB_URI = `mongodb+srv://olga:ZgS8wUdBef2SIMBm@cluster0-dwk9a.mongodb.net/shop?retryWrites=true&w=majority`;
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf()) 
app.use(flash())             //добавить после сессии
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRouts);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
