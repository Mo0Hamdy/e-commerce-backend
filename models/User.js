const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;
const UserSchema = new schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 100,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      unique:true,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    password: { type: String, trim: true, required: true, minlength: 5 },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "4h" },
  );
};

// Validate Register User

function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().required().trim().min(5).max(100).email(),
    firstName: Joi.string().required().trim().min(3).max(200),
    lastName: Joi.string().required().trim().min(3).max(200),
    password: Joi.string().required().trim().min(5),
  });
  return schema.validate(obj);
}

// Validate Login User

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().required().trim().min(5).max(100).email(),
    password: Joi.string().required().trim().min(5),
  });
  return schema.validate(obj);
}

// Validate Update User

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    firstName: Joi.string().trim().min(3).max(200),
    lastName: Joi.string().trim().min(3).max(200),
    password: Joi.string().trim().min(5),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(obj);
}

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validateLoginUser,
  validateRegisterUser,
  validateUpdateUser,
};
