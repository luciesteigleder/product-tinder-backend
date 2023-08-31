import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tag_name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z\s_-]+$/.test(value);
      },
      message: "Tag name must contain only letters.",
    },
  },
  tag_stem: {
    type: String,
    required: true,
  },

  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  prov_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prov",
  },
});

const Tag = mongoose.model("Tag", tagSchema);

export { Tag, tagSchema };
