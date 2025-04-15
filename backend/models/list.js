const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  pdcas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDCA",
    },
  ],
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FOLDER",
  },
});

const LIST = mongoose.model("LIST", listSchema);

module.exports = LIST;
