import mongoose from "mongoose";
import axios from "axios";

//Function to get the coordinates from address
const getCoordinates = async (address) => {
  try {
    if (!address) {
      throw new Error("Address is missing");
    }
    const geocodify = await axios.get(
      `https://api.geocodify.com/v2/geocode?api_key=${process.env.GEO_KEY}&q=${address}`
    );
    const html = geocodify.data;
    const coordinates = html.response.features[0].geometry;
    return coordinates;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//provGeoSchema
const provGeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
    required: true,
  },
});

//provTagSchema
const provTagSchema = new mongoose.Schema({
  tag_name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: "Tag name must contain only letters, and can only be one word.",
    },
  },
  tag_stem: {
    type: String,
  },
});

const provSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: provGeoSchema,
  prov_name: {
    type: String,
    required: true,
  },
  prov_address: {
    type: String,
    required: true,
  },
  prov_phone: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String, // to be confirmed, either saved on the server or on mongodb
  },
  language: {
    type: String,
    required: true,
  },
  score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  price_score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  testimonials: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  tags: [provTagSchema],
  categories: {
    type: [String],
    ref: "Category",
  },
});

const Prov = mongoose.model("Prov", provSchema);

export { Prov, provSchema, getCoordinates };
