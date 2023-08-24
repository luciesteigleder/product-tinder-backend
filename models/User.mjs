import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile_type: {
    type: Boolean, //do we really ant boolean ? Yes-no
    required: true,
  },
});

userSchema.pre('save', async (next) => {
    console.log("test middleware");
    next();
}) 
const User = mongoose.model("User", userSchema);

export { User, userSchema };
