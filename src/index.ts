import "colors";

import connectDB from "./db";
import { app } from "./app";
import { PORT } from "./constants/envs";

// cleaning log on refresh
console.clear();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        "Server is running at port :".green,
        process.env.PORT?.toString().blue
      );
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
