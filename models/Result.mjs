import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  prov_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prov",
      required: true,
    },
  ],
});

const Result = mongoose.model("Result", resultSchema);

export { Result, resultSchema };
