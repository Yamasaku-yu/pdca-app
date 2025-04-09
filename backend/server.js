const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const pdcaModel = require("./models/pdca");
const listModel = require("./models/list");
const bcrypt = require("bcrypt");
const userModel = require("./models/user");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

require("dotenv").config();

app.set('trust proxy', 1);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("データベース接続に成功しました"))
  .catch((err) => console.log(err));

app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:process.env.MONGO_URI,
      collectionName:"sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN_1,
  process.env.FRONTEND_ORIGIN_2,
  process.env.FRONTEND_ORIGIN_3,
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(express.static("pdca-next-app"));

const PORT = process.env.PORT || 5000;

app.post("/api/pdca/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const newUser = new userModel({
    username,
    password: hash,
  });
  await newUser.save();
  req.session.userId = newUser._id;
  req.session.save();
  res.status(201).json({ userId: newUser._id });
});

app.post("/api/pdca/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    req.session.userId = user._id;
    req.session.save();
    res.status(201).json({ userId: user._id });
  }
});

app.post("/api/pdca/logout", async (req, res) => {
  console.log(req.session.userId);
  req.session.userId = null;
  req.session.save();
  res.json({ message: "Logged out", session: req.session.userId });
});

app.get("/api/pdca/session", (req, res) => {
  res.json({ session: req.session.userId });
});

app.get("/api/pdca/user/:userId", async (req, res) => {
  const user = await userModel.findById(req.params.userId).populate("lists");
  const listData = user.lists;
  res.json(listData);
});

app.post("/api/pdca/user/:userId", async (req, res) => {
  const user = await userModel.findById(req.params.userId);
  const newList = new listModel(req.body);
  user.lists.push(newList);
  newList.user = user;
  await user.save();
  await newList.save();
  res.status(201).json(newList);
});

app.get("/api/pdca/user/:userId/lists/:listId", async (req, res) => {
  const list = await listModel.findById(req.params.listId).populate("pdcas");
  const pdcaData = list.pdcas;
  res.json({ pdcaData, listName: list.name });
});

app.post("/api/pdca/user/:userId/lists/:listId", async (req, res) => {
  const { listId } = req.params;
  const list = await listModel.findById(listId);
  const { stage, description } = req.body;
  const newPdca = new pdcaModel({ stage, description });
  list.pdcas.push(newPdca);
  newPdca.list = list;
  await list.save();
  await newPdca.save();
  res.status(201).json(newPdca);
});

app.delete("/api/pdca/user/:userId/lists/:listId", async (req, res) => {
  const { userId, listId } = req.params;
  console.log("userId", userId, "listId", listId);
  await userModel.findByIdAndUpdate(userId, { $pull: { lists: listId } });
  const deleteList = await listModel.findByIdAndDelete(listId);
  await pdcaModel.deleteMany({ list: listId });
  res.json(deleteList);
});

app.put("/api/pdca/user/:userId/lists/:listId", async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;
  const editList = await listModel.findByIdAndUpdate(
    listId,
    {
      name,
    },
    { new: true }
  );
  res.json(editList);
});

app.put("/api/pdca/user/:userId/lists/:listId/:pdcaId", async (req, res) => {
  const { pdcaId } = req.params;
  const { stage, description } = req.body;
  const editPdca = await pdcaModel.findByIdAndUpdate(
    pdcaId,
    { stage, description },
    { new: true }
  );
  res.json(editPdca);
});

app.delete("/api/pdca/user/:userId/lists/:listId/:pdcaId", async (req, res) => {
  const { listId, pdcaId } = req.params;
  await listModel.findByIdAndUpdate(listId, { $pull: { pdcas: pdcaId } });
  const deletePdca = await pdcaModel.findByIdAndDelete(pdcaId);
  res.json(deletePdca);
});

app.get("/example", async (req, res) => {
  const pdcas = await listModel.find({});
  try {
    res.send(pdcas);
  } catch {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
