// define proxy to the API port at /albums/
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/albums/", {target: "http://localhost:8000/"})
  );
};
