const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  discription: {
    type: String,
  },
  pdca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDCA",
  },
  list:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "LIST"
  },
  folder:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FOLDER"
  },
});

const TODO = mongoose.model("TODO", pdcaSchema);

module.exports = TODO;

