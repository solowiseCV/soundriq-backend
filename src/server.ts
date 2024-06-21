import app from "./app";
const {port} = require("./config/index")

app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}`);
});
