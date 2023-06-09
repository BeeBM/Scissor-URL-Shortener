import mongoose, { Document } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuv0987654321", 6);

export interface ShortURL extends Document {
  shortId: string;
  destination: string;
}

const schema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    default: () => nanoid(),
  },
  destination: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const shortUrl = mongoose.model<ShortURL>("shortUrl", schema);

export default shortUrl;