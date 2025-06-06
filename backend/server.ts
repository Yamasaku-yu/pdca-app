import express,{ Request, Response } from "express";
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const todoModel = require("../models/todo");
const pdcaModel = require("../models/pdca");
const listModel = require("../models/list");
const folderModel = require("../models/folder");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
import session from "express-session";
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

type MyError = Error & {
  status?: number;
  code?: string;
};

require("dotenv").config();

app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("データベース接続に成功しました"))
  .catch((err: MyError) => console.log(err));

app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set in environment variables");
}

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
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
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow: boolean) => void
    ) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(express.static("pdca-next-app"));

const PORT = process.env.PORT || 5000;

app.post(
  "/api/pdca/register",
  async (
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
  ):Promise<any> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "ユーザー名とパスワードを入力してください。" });
      }
      const existingUser = await userModel.findOne({ username });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "このユーザー名は既に使われています。" });
      }
      const hash = await bcrypt.hash(password, 12);
      const newUser = new userModel({
        username,
        password: hash,
      });
      await newUser.save();
      req.session.userId = newUser._id;
      await req.session.save();
      res.status(201).json({ userId: newUser._id });
    } catch (error) {
      console.error("ユーザー登録エラー：", error);
      res.status(500).json({
        message: "サーバーエラーが発生しました。もう一度お試しください。",
      });
    }
  }
);

app.post(
  "/api/pdca/login",
  async (
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
  ):Promise<any> => {
    console.log(req.body);
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "ユーザー名とパスワードを入力してください。" });
      }
      const user = await userModel.findOne({ username });
      console.log(user);
      if (!user) {
        return res
          .status(401)
          .json({ message: "ユーザー名またはパスワードが正しくありません。" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res
          .status(401)
          .json({ message: "ユーザー名またはパスワードが正しくありません。" });
      }
      req.session.userId = user._id;
      await req.session.save();
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error("ログインエラー：", error);
      res.status(500).json({
        message: "サーバーエラーが発生しました。もう一度お試しください。",
      });
    }
  }
);

app.post("/api/pdca/logout", async (req: Request, res: Response) => {
  console.log(req.session.userId);
  req.session.userId = undefined;
  req.session.save();
  res.json({ message: "Logged out", session: req.session.userId });
});

app.get("/api/pdca/session", (req: Request, res: Response) => {
  res.json({ session: req.session.userId });
});

app.get(
  "/api/pdca/user/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const user = await userModel
      .findById(req.params.userId)
      .populate("folders");
    const folderData = user.folders;
    res.json(folderData);
  }
);

app.post(
  "/api/pdca/user/:userId",
  async (
    req: Request<{ userId: string }, {}, { name: string }>,
    res: Response
  ) => {
    const user = await userModel.findById(req.params.userId);
    const newFolder = new folderModel(req.body);
    user.folders.push(newFolder);
    newFolder.user = user;
    await user.save();
    await newFolder.save();
    res.status(201).json(newFolder);
  }
);

app.delete(
  "/api/pdca/user/:userId/folders/:folderId",
  async (req: Request<{ userId: string; folderId: string }>, res: Response) => {
    const { userId, folderId } = req.params;
    await userModel.findByIdAndUpdate(userId, { $pull: { folders: folderId } });
    const deleteFolder = await folderModel.findByIdAndDelete(folderId);
    await listModel.deleteMany({ folder: folderId });
    await pdcaModel.deleteMany({ folder: folderId });
    await todoModel.deleteMany({ folder: folderId });
    res.json(deleteFolder);
  }
);

app.put(
  "/api/pdca/user/:userId/folders/:folderId",
  async (
    req: Request<{ userId: string; folderId: string }, {}, { name: string }>,
    res: Response
  ) => {
    const { folderId } = req.params;
    const { name } = req.body;
    const editFolder = await listModel.findByIdAndUpdate(
      folderId,
      {
        name,
      },
      { new: true }
    );
    res.json(editFolder);
  }
);

app.get(
  "/api/pdca/user/:userId/folders/:folderId",
  async (req: Request<{ userId: string; folderId: string }>, res: Response) => {
    const folder = await folderModel
      .findById(req.params.folderId)
      .populate("lists");
    res.json({ listData: folder.lists, folderName: folder.name });
  }
);

app.post(
  "/api/pdca/user/:userId/folders/:folderId",
  async (
    req: Request<
      { userId: string; folderId: string },
      {},
      { name: string; color: string }
    >,
    res: Response
  ) => {
    const folder = await folderModel.findById(req.params.folderId);
    const newList = new listModel(req.body);
    folder.lists.push(newList);
    newList.folder = folder;
    await folder.save();
    await newList.save();
    res.status(201).json(newList);
  }
);

app.put(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId",
  async (
    req: Request<
      { userId: string; folderId: string; listId: string },
      {},
      { name: string; color: string }
    >,
    res: Response
  ) => {
    const list = await listModel.findByIdAndUpdate(
      req.params.listId,
      req.body,
      {
        new: true,
      }
    );
    res.json(list);
  }
);

app.delete(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId",
  async (
    req: Request<{ userId: string; folderId: string; listId: string }>,
    res: Response
  ) => {
    const { listId, folderId } = req.params;
    const deleteList = await listModel.findByIdAndDelete(listId);
    await folderModel.findByIdAndUpdate(folderId, { $pull: { lists: listId } });
    await pdcaModel.deleteMany({ list: listId });
    await todoModel.deleteMany({ list: listId });
    res.json(deleteList);
  }
);

app.get(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId",
  async (
    req: Request<{ userId: string; folderId: string; listId: string }>,
    res: Response
  ) => {
    const list = await listModel
      .findById(req.params.listId)
      .populate("pdcas")
      .populate({
        path: "pdcas",
        populate: {
          path: "todos",
          model: "TODO",
          select: "-pdca",
        },
      });
    const pdcaData = list.pdcas;
    res.json({ pdcaData, listName: list.name });
  }
);

app.post(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId",
  async (
    req: Request<
      { userId: string; folderId: string; listId: string },
      {},
      { stage: string; discription: "" }
    >,
    res: Response
  ) => {
    const { folderId, listId } = req.params;
    const list = await listModel.findById(listId);
    const folder = await folderModel.findById(folderId);
    const newPdca = new pdcaModel(req.body);
    list.pdcas.push(newPdca);
    newPdca.list = list;
    newPdca.folder = folder;
    await list.save();
    await newPdca.save();
    res.status(201).json(newPdca);
  }
);

app.put(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId/:pdcaId",
  async (
    req: Request<
      { userId: string; folderId: string; listId: string; pdcaId: string },
      {},
      { stage: string; discription: string }
    >,
    res: Response
  ) => {
    const { pdcaId } = req.params;
    const { stage, discription } = req.body;
    const editPdca = await pdcaModel.findByIdAndUpdate(
      pdcaId,
      { stage, discription },
      { new: true }
    );
    res.json(editPdca);
  }
);

app.delete(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId/:pdcaId",
  async (
    req: Request<{
      userId: string;
      folderId: string;
      listId: string;
      pdcaId: string;
    }>,
    res: Response
  ) => {
    const { listId, pdcaId } = req.params;
    await listModel.findByIdAndUpdate(listId, { $pull: { pdcas: pdcaId } });
    const deletePdca = await pdcaModel.findByIdAndDelete(pdcaId);
    await todoModel.deleteMany({ pdca: pdcaId });
    res.json(deletePdca);
  }
);

app.post(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId/:pdcaId",
  async (
    req: Request<
      { userId: string; folderId: string; listId: string; pdcaId: string },
      {},
      { discription: ""; check: boolean }
    >,
    res: Response
  ) => {
    const { discription, check } = req.body;
    const { folderId, listId, pdcaId } = req.params;
    const folder = await folderModel.findById(folderId);
    const list = await listModel.findById(listId);
    const pdca = await pdcaModel.findById(pdcaId);
    const newTodo = new todoModel({
      discription,
      check,
      folder,
      list,
      pdca,
    });
    pdca.todos.push(newTodo);
    await newTodo.save();
    await pdca.save();
    newTodo.pdca = undefined;
    res.json(newTodo);
  }
);

app.put(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId/:pdcaId/:todoId",
  async (
    req: Request<
      {
        userId: string;
        folderId: string;
        listId: string;
        pdcaId: string;
        todoId: string;
      },
      {},
      { discription?: string; check?: boolean }
    >,
    res: Response
  ) => {
    const todo = await todoModel.findByIdAndUpdate(req.params.todoId, req.body);
    res.json(todo);
  }
);

app.delete(
  "/api/pdca/user/:userId/folders/:folderId/lists/:listId/:pdcaId/:todoId",
  async (
    req: Request<{
      userId: string;
      folderId: string;
      listId: string;
      pdcaId: string;
      todoId: string;
    }>,
    res: Response
  ) => {
    const { pdcaId, todoId } = req.params;
    await pdcaModel.findByIdAndUpdate(pdcaId, { $pull: { todos: todoId } });
    const deleteTodo = await todoModel.findByIdAndDelete(todoId);
    res.json(deleteTodo);
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
