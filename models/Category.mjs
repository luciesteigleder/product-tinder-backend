import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
  },
  category_description: {
    type: String,
  },
  category_logo: {
    type: String, // to be confirmed, either saved on the server or on mongodb
  },
});

const Category = mongoose.model("Category", categorySchema);

export { Category, categorySchema };
