import mongoose from "mongoose";
import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import logger from "morgan";
import Data from "./data";
import getSecret from "./secret";

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();
const dbRoute = getSecret("dbUri");

if (!dbRoute) {
  throw new Error("DATABASE_URL is not defined");
}

mongoose.connect(dbRoute, {
  serverSelectionTimeoutMS: 30000,
});

mongoose.connection.once("open", () => {
  console.log("connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));

router.get("/getData", async (req: Request, res: Response) => {
  try {
    const data = await Data.find();
    return res.json({ success: true, data: data });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

router.post("/updateData", async (req: Request, res: Response) => {
  const { id, update } = req.body;

  try {
    await Data.findByIdAndUpdate(id, update);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

router.delete("/deleteData", async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await Data.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

router.post("/putData", async (req: Request, res: Response) => {
  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS",
    });
  }

  try {
    let data = new Data({ id, message });
    await data.save();
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
