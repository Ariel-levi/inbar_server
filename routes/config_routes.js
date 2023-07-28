const indexR = require("./index");
const usersR = require("./users");
// const productsR = require("./products");
// const storeR = require("./stores");
// const favR = require("./favProducts");
// const ordersR = require("./orders");
// const emailR = require("./email");
// const uploadFilesR = require("./uploadFiles");

exports.corsAccessControl = (app) => {
  app.all("*", function (req, res, next) {
    if (!req.get("Origin")) return next();

    // res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.set("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,auth-token,x-api-key"
    );
    next();
  });
};

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  // app.use("/products", productsR);
  // app.use("/stores", storeR);
  // app.use("/favs", favR);
  // app.use("/orders", ordersR);
  // app.use("/email", emailR);
  // app.use("/uploadFiles", uploadFilesR);

  app.use((req, res) => {
    res.status(404).json({ msg_error: "Url not found , 404!" });
  });
};
