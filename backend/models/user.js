const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FOLDER",
    },
  ],
});

const USER = mongoose.model("USER", userSchema);

module.exports = USER;
