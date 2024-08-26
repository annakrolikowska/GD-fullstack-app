import mongoose, { Document, Model, Schema } from "mongoose";

interface IData extends Document {
  id: number;
  message: string;
}

const DataSchema: Schema<IData> = new Schema(
  {
    id: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Data: Model<IData> = mongoose.model<IData>("Data", DataSchema);
export default Data;
