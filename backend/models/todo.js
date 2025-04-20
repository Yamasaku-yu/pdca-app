const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  discription: {
    type: String,
  },
  check: {
    type:Boolean,
  },
  pdca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDCA",
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LIST",
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FOLDER",
  },
});

const TODO = mongoose.model("TODO", todoSchema);

module.exports = TODO;
