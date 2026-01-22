
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5000;

//this is middlewares
server.use(middlewares);
server.use(router);

//this is server 
server.listen(PORT, () => {
  console.log("JSON Server running on port", PORT);
});
