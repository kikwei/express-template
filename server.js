const express = require("express");
const connectDatabase = require("./config/db");

const app = express();

//Connect to Database
connectDatabase();

app.use(express.json());

//Routes
app.use("/cemasclone/api/v1/products", require("./routes/api/products"));
app.use("/cemasclone/api/v1/users", require("./routes/api/users"));
app.use("/cemasclone/api/v1/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on portr ${PORT}`));
