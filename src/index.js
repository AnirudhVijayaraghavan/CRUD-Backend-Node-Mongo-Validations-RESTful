const express = require("express");
const userRoutes = require('./routes/userRoutes')
const cors = require("cors"); /* cors is a middleware. it will add some headers in each response and our API can be called from everywhere*/
const mongoose = require("mongoose");

const app = express();


app.use(express.json()); // called because express cannot handle a json file directly
app.use(cors());

app.use("/user", userRoutes)


app.get("/", (req, res) => {
  res.send("User API");
});


const PORT = 3000;
const newmongooseconnect = "mongodb+srv://Anirudhv1997:admin123@cluster0.kapz18z.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(
    newmongooseconnect
  )
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
