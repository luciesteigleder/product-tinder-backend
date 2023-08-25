import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tag_name: {
    type: String,
    required: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);

export { Tag, tagSchema };
