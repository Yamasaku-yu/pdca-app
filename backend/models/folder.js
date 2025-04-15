const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LIST",
      },
    ],
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
});

const FOLDER = mongoose.model("FOLDER",folderSchema);

module.exports = FOLDER;
