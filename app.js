const express=require("express");
const logger =  require("./middlewares/logger")
const {errorHandler ,notFound }=require("./middlewares/errors")
 require("dotenv").config();
const connectToDB = require("./config/db");

connectToDB();
       

const app=express();


// apply middleware
app.use(express.json());
app.use(logger)
app.use("/api/teams",require("./routes/teams"));
 app.use("/api/books",require("./routes/books"));
 app.use("/api/auth",require("./routes/auth"));
 app.use("/api/users",require("./routes/users"));

 //error handler middleware
 app.use(notFound);
 app.use(errorHandler);
const port=process.env.PORT || 5000; 

app.listen(port,()=> console.log(`server is running in ${process.env.NODE_ENV} mode on port ${port}`));
  