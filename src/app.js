import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import urlRoute from "./routes/url.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use([userRoute, urlRoute]);
const port = process.env.PORT || 5231;
app.listen(port, () => {
  console.log("server rodando");
});
