const mongoose = require("mongoose");

const pdcaSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LIST",
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FOLDER",
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TODO",
    }
  ],
});

const PDCA = mongoose.model("PDCA", pdcaSchema);

module.exports = PDCA;
