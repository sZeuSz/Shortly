import cors from 'cors';
import dotenv from "dotenv";
import express, { json } from "express";
dotenv.config();

import router from "./routes/index.js";

const app = express();

app.use(json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Mode: ${process.env.MODE || "DEV"}`);
  console.log(`Server is up on port: ${port}`);
});