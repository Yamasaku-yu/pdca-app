import { useState, useEffect } from "react";
import AddForm from "../../../../../components/add/addForm";
import AlertButton from "../../../../../components/add/alertButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../../../../components/navbar";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../../../styles/Card.module.css";

export default function List() {
  const [listData, setListData] = useState([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("white");
  const [editing, setEditing] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [alertState, setAlertState] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedColor, setEditedColor] = useState("");

  const router = useRouter();
  const { userId, folderId } = router.query;
  const colors = ["white", "red", "yellow", "green", "blue"];

  useEffect(() => {
    if (folderId) {
      fetchData();
    }
  }, [folderId]);

  const fetchData = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setListData(data.listData);
        setFolderName(data.folderName);
      });
  };

  const addList = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      }
    )
      .then((res) => res.json)
      .then(() => {
        setNewName("");
        setNewColor("white");
        fetchData();
      });
  };

  const changeData = (listId) => {
    fetch(
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

  const deleteList = (listId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      { method: "DELETE" }
    ).then(() => fetchData());
  };

  return (
    <>
      <Navbar brandUrl={`pdca/user/${userId}`} />
      <div className="container">
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
            onClick={() => {
              setEditing(!editing);
              setEditingId("");
            }}
          >
            {editing ? "終了" : "編集"}
          </button>
        ) : null}
        {alertState && (
          <div className="row alert alert-secondary my-2">
            <div className="col-auto">
              <select
                className={`form-select ${styles[newColor]}`}
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              >
                {colors?.map((color) => (
                  <option value={color} key={color} className={styles[color]}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <AddForm
              newDiscription={newName}
              setNewDiscription={setNewName}
              addPdca={addList}
            />
          </div>
        )}
        <ul className="list-unstyled">
          {listData?.map((item) => (
            <li key={item?._id} className="mb-2">
              <Link
                className={`card text-decoration-none ${styles[item?.color]}`}
                href={
                  editing
                    ? "#"
                    : `/pdca/user/${userId}/folders/${folderId}/lists/${item?._id}`
                }
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
                            style={{ "--bs-btn-padding-y": " .1000rem" }}
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
    </>
  );
}
