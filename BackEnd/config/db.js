const mongoose = require("mongoose");
mongoose
        .connect("mongodb+srv://" + process.env.DB_USER_PASS + "@gamepix.do3yn.mongodb.net/GamePix",

)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log("Failed to connect to MongoDB", err))