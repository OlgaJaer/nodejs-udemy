const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
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
const profileRoutes = require("./routes/profile");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");
const keys = require("./keys");
//const MONGODB_URI = `mongodb+srv://olga:ZgS8wUdBef2SIMBm@cluster0-dwk9a.mongodb.net/shop?retryWrites=true&w=majority`;
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require("./utils/hbs-helpers"),
});
const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(fileMiddleware.single("avatar")); //подключить до csrf
app.use(csrf());
app.use(flash()); //добавить после сессии
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRouts);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler); //после всех роутов

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
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
