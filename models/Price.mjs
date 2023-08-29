import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
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
  price_creation: {
    type: Date,
    default: Date.now,
  },
  price_value: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 0 && value <= 5 && value % 0.5 === 0;
      },
      message: "price must be a number between 0 and 5 with a 0.5 increment",
    },
    required: true,
  },
});

const Price = mongoose.model("Price", priceSchema);

export { Price, priceSchema };
