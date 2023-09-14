import mongoose from "mongoose";
import axios from "axios";

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

//shopGeoSchema
const shopGeoSchema = new mongoose.Schema({
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

//shopResultsSchema
// const shopResultsSchema = new mongoose.Schema({
//   prov_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Prov",
//     required: true,
//   },
//   distance: {
//     type: Number,
//   },
// });

//shopSearchSchema
// const shopSearchSchema = new mongoose.Schema({
//   criteria: {
//     type: Object,
//   },
//   results: shopResultsSchema,
// });
const resultSchema = new mongoose.Schema ({
  distance: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  prov_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prov",
    required: true
  }
})

const searchSchema = new mongoose.Schema ({
  distance_max: {
    type: Number,
    required: true
  },
  search_categories: {
    type: [String]
  },
  search_tags: {
    type: [String]
  },
  results: [resultSchema]
})


const shopSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: shopGeoSchema,
  shop_name: {
    type: String,
    required: true,
  },
  shop_address: {
    type: String,
    required: true,
  },
  shop_phone: {
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
  fav_prov: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  search: [searchSchema]
});


const Shop = mongoose.model("Shop", shopSchema);

export { Shop, shopSchema, getCoordinates };
