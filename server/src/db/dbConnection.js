import mongoose from "mongoose";

// Connection URI for MongoDB Atlas
const dbUri =
  "mongodb+srv://mdkamran12310:kamran141@cluster0.puc3boq.mongodb.net/tictactoe?retryWrites=true&w=majority";

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  });
