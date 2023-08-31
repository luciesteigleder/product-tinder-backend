import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
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
  score_creation: {
    type: Date,
    default: Date.now,
  },
  score_value: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 0 && value <= 5 && value % 0.5 === 0;
      },
      message: "Score must be a number between 0 and 5 with a 0.5 increment",
    },
    required: true,
  },
});

const Score = mongoose.model("Score", scoreSchema);

export { Score, scoreSchema };
