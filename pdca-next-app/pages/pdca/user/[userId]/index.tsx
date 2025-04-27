import { useState, useEffect } from "react";
import AddForm from "../../../components/add/addForm";
import AlertButton from "../../../components/add/alertButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../../../components/card";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/router";

type FolderType = {
  _id:string;
  name:string;
}

export default function Folder() {
  const [folderData, setFolderData] = useState<FolderType[]>([]);
  const [alertState, setAlertState] = useState<boolean>(false);
  const [newFolder, setNewFolder] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [nameEditingId, setNameEditingId] = useState<string>("");
  const [editedName, setEditedName] = useState<string>("");

  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userId) {
      console.log(userId);
      fetchData();
    }
  }, [userId]);

  const fetchData = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setFolderData(data));
  };

  const addFolder = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}`, {
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

  const deleteFolder = (folderId:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}`,
      {
        method: "DELETE",
      }
    ).then(() => fetchData());
  };

  const nameChange = (folderId:string) => {
    return fetch(
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

  const resetState = () => {
    setEditing(false);
    setAlertState(false);
    setNameEditingId("");
  }

  return (
    <>
      <Navbar brandUrl={`/pdca/user/${userId}`}>
        <li className="nav-item">
          <a className="nav-link" href={`/pdca/user/${userId}`}>
            フォルダ
          </a>
        </li>
      </Navbar>
      <div className="container min-vh-100" onClick={resetState}>
        <h3 className="mt-3">PDCAフォルダ</h3>
        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setEditing={setEditing}
          setNameEditingId={setNameEditingId}
        />
        {folderData.length ? (
          <button
            className="btn btn-secondary ms-2"
            onClick={(e:React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setEditing(!editing);
              setNameEditingId("");
            }}
          >
            {editing ? "終了" : "編集"}
          </button>
        ) : null}
        {alertState && (
          <div className="row">
            <div className="col-auto alert alert-secondary my-2" onClick={(e:React.MouseEvent<HTMLDivElement>)=>e.stopPropagation()}>
              <AddForm
                newDiscription={newFolder}
                setNewDiscription={setNewFolder}
                addPdca={addFolder}
              />
            </div>
          </div>
        )}
        <ul className="list-unstyled">
          {folderData.map((item) => (
            <li key={item?._id} className="mt-3">
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
      <footer className="bg-dark text-white text-center fixed-bottom">
        画面の一番下のフッター
      </footer>
    </>
  );
}
