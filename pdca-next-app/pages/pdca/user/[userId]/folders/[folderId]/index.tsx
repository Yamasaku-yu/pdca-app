import { useState, useEffect } from "react";
import AddForm from "../../../../../components/add/addForm";
import AlertButton from "../../../../../components/add/alertButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../../../../components/navbar";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../../../styles/Card.module.css";
import {useAppSelector} from "../../../../../../redux/hooks"
import FilterForm from "../../../../../components/FilterForm";

type ListType = {
  _id:string;
  name:string;
  color:string;
}

export default function List() {
  const [listData, setListData] = useState<ListType[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newColor, setNewColor] = useState<string>("white");
  const [editing, setEditing] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [alertState, setAlertState] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>("");
  const [editedName, setEditedName] = useState<string>("");
  const [editedColor, setEditedColor] = useState<string>("");

  const router = useRouter();
  const { userId, folderId } = router.query;
  const colors = ["white", "red", "yellow", "green", "blue"];
  const stages = ["Plan", "Do", "Check", "Action"];
  const {category,period,keyword} = useAppSelector(state=>state.filter);

  const filteredList = listData.filter((list)=>{
    const matchCategory = category==="すべて"||category === list.color;
    const matchKeyword = list.name.includes(keyword);

    return matchCategory && matchKeyword;
  });

  useEffect(() => {
    if (folderId) {
      fetchData();
    }
  }, [folderId]);

  const fetchData = () => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setListData(data.listData);
        setFolderName(data.folderName);
      });
  };

  const addList = () => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setNewName("");
        setNewColor("white");
        stages.map((stage) => addPdca(data._id, stage));
        fetchData();
      });
  };

  const changeData = (listId:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName, color: editedColor }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setEditingId("");
        setEditedName("");
        setEditedColor("");
        fetchData();
      });
  };

  const deleteList = (listId:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      { method: "DELETE" }
    ).then(() => fetchData());
  };

  const addPdca = (listId:string, stage:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, discription: "" }),
      }
    );
  };

  const resetState = () => {
    setAlertState(false);
    setEditing(false);
    setEditingId("");
    setEditedName("");
    setEditedColor("");
  };
  return (
    <>
      <Navbar brandUrl={`/pdca/user/${userId}`}>
        <li className="nav-item">
          <a className="nav-link" href={`/pdca/user/${userId}`}>
            フォルダ
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href={`/pdca/user/${userId}/folders/${folderId}`}
          >
            リスト
          </a>
        </li>
      </Navbar>
      <div className="container min-vh-100" onClick={resetState}>
        <h3 className="mt-3">{folderName}</h3>
        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setEditing={setEditing}
          setNameEditingId={setEditingId}
        />
        {listData.length ? (
          <button
            className="btn btn-secondary ms-2"
            onClick={(e:React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setEditing(!editing);
              setEditingId("");
            }}
          >
            {editing ? "終了" : "編集"}
          </button>
        ) : null}
        {alertState && (
          <div className="row">
            <div className="col-auto alert alert-secondary my-2" onClick={(e:React.MouseEvent<HTMLDivElement>)=>e.stopPropagation()}>
              <div className="row">
                <div className="col-auto">
                  <select
                    className={`form-select ${styles[newColor]}`}
                    value={newColor}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setNewColor(e.target.value)}
                  >
                    {colors?.map((color) => (
                      <option
                        value={color}
                        key={color}
                        className={styles[color]}
                      >
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <AddForm
                  newDiscription={newName}
                  setNewDiscription={setNewName}
                  addPdca={addList}
                  inputDiscription={"リスト名"}
                />
              </div>
            </div>
          </div>
        )}
        <FilterForm/>
        <ul className="list-unstyled">
          {filteredList?.map((item) => (
            <li key={item?._id} className="mt-3">
              <Link
                className={`card text-decoration-none ${styles[item?.color]}`}
                href={
                  editing
                    ? "#"
                    : `/pdca/user/${userId}/folders/${folderId}/lists/${item?._id}`
                }
                onClick={(e:React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
              >
                <div className={`card-body row`}>
                  {editingId === item?._id ? (
                    <>
                      <div className="col">
                        <input
                          className="form-control text-start"
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select"
                          value={editedColor}
                          onChange={(e) => setEditedColor(e.target.value)}
                        >
                          {colors?.map((color) => (
                            <option value={color} key={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="col text-start"> {item?.name}</div>
                  )}
                  {editing ? (
                    <div className="col text-end">
                      <div className="row justify-content-end">
                        <div className="col">
                          {editingId === item?._id ? (
                            <button
                              className="btn btn-dark btn-sm"
                              onClick={
                                editedName
                                  ? () => changeData(item?._id)
                                  : undefined
                              }
                            >
                              決定
                            </button>
                          ) : (
                            <button
                              className={`btn btn-sm ${styles.bgDark}`}
                              onClick={() => {
                                setEditingId(item?._id);
                                setEditedName(item?.name);
                                setEditedColor(item?.color);
                              }}
                            >
                              編集
                            </button>
                          )}
                        </div>
                        <div className=" col-3">
                          <button
                            className="btn btn-outline-dark btn-sm"
                            style={{ "--bs-btn-padding-y": " .1000rem" } as React.CSSProperties}
                            onClick={() => deleteList(item?._id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <footer className="bg-dark text-white text-center fixed-bottom">
        画面の一番下のフッター
      </footer>
    </>
  );
}
