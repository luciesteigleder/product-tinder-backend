import mongoose from "mongoose";

const testiSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  prov_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prov",
    required: true,
  },
  testi_creation: {
    type: Date,
    default: Date.now,
  },
  testi_text: {
    type: String,
    required: true,
  },
});

const Testi = mongoose.model("Testi", testiSchema);

export { Testi, testiSchema };
