import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"
const { isEmail } = validator

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "password needs to be at least 6 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, "email is not valid"]
  },
  profile_type: {
    type: Boolean, //do we really ant boolean ? Yes-no
    required: true,
  },
});

//Middleware to hash password for sign ups
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Static method to login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('wrong password')
  }
  throw Error("wrong email");
};

const User = mongoose.model("User", userSchema);

export { User, userSchema };
