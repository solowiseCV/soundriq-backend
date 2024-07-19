import app from "./app";
const PORT = require("./config/index").PORT;
const HOST = require("./config/index").HOST;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
});
