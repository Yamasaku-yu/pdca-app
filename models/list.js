const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pdcas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDCA",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
});

const LIST = mongoose.model("LIST", listSchema);

module.exports = LIST;
