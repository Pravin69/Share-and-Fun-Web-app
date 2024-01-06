import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
// Security
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

dotenv.config();
const __dirname = path.resolve(path.dirname(""));
// Allow requests from a specific origin
const corsOptions = {
  origin: "https://share-and-fun-web-app.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // enable set cookie with credentials (in case of sessions)
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "views/build")));

app.use(helmet());
// converts request body to JSON.
app.use(express.json({ limit: "10mb" }));
// converts form data to json
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(router);

// error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3800;
dbConnection();
app.listen(PORT, () => {
  console.log(`Dev Server is running on port: ${PORT}`);
});
