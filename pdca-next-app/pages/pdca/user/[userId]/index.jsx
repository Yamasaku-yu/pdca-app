import { useState, useEffect } from "react";
import AddForm from "../../../components/add/addForm";
import AlertButton from "../../../components/add/alertButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../../../components/card";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/router";
import styles from "../../../styles/Card.module.css"

export default function Folder() {
  const [folderData, setFolderData] = useState([]);
  const [alertState, setAlertState] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [editing, setEditing] = useState(false);
  const [nameEditingId, setNameEditingId] = useState("");
  const [editedName, setEditedName] = useState("");

  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userId) {
      console.log(userId);
      fetchData();
    }
  }, [userId]);

  const fetchData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setFolderData(data));
  };

  const addFolder = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolder }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNewFolder("");
        fetchData();
      });
  };

  const deleteFolder = (folderId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`,
      {
        method: "DELETE",
      }
    ).then(() => fetchData());
  };

  const nameChange = (folderId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      }
    ).then(() => {
      setNameEditingId("");
      setEditedName("");
      fetchData();
    });
  };

  return (
    <>
      <Navbar brandUrl={`pdca/user/${userId}`} />
      <div className="container">
        <h3 className="mt-3">PDCAフォルダ</h3>
        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setEditing={setEditing}
          setNameEditingId={setNameEditingId}
        />
        {folderData.length? (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditing(!editing);
              setNameEditingId("");
            }}
          >
            {editing ? "終了" : "編集"}
          </button>
        ):(null)}
        {alertState && (
          <div className="row alert alert-secondary my-2">
            <AddForm
              newDiscription={newFolder}
              setNewDiscription={setNewFolder}
              addPdca={addFolder}
            />
          </div>
        )}
        <ul className="list-unstyled">
          {folderData.map((item) => (
            <li key={item._id} className="mb-2">
              <Card
                item={item}
                userId={userId}
                editing={editing}
                deleteFolder={deleteFolder}
                nameEditingId={nameEditingId}
                setNameEditingId={setNameEditingId}
                editedName={editedName}
                setEditedName={setEditedName}
                nameChange={nameChange}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
