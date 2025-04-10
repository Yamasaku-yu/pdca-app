import { useState, useEffect } from "react";
import AddForm from "../../../../components/pdca/add/addForm";
import AlertButton from "../../../../components/pdca/add/alertButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "../../../components/card";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/router";

export default function List() {
  const [listData, setListData] = useState([]);
  const [alertState, setAlertState] = useState(false);
  const [newList, setNewList] = useState();
  const [editing, setEditing] = useState(false);
  const [nameEditingId, setNameEditingId] = useState();
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
      .then((data) => setListData(data));
  };

  const addList = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newList }),
    })
      .then((res) => res.json)
      .then(() => {
        setNewList("");
        fetchData();
      });
  };

  const deleteList = (listId) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/lists/${listId}`, {
      method: "DELETE",
    }).then(() => fetchData());
  };

  const nameChange = (listId) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editedName }),
    }).then(() => {
      setNameEditingId("");
      setEditedName("");
      fetchData();
    });
  };

  return (
    <>
      <Navbar brandUrl={`pdca/user/${userId}`} />
      <div className="container">
        <h1>PDCAフォルダ</h1>
        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setEditing={setEditing}
          setNameEditingId={setNameEditingId}
        />
        <button
          className="btn btn-secondary ms-2"
          onClick={() => {
            setEditing(!editing);
            setNameEditingId("");
          }}
        >
          {editing ? "終了" : "編集"}
        </button>
        {alertState && (
          <div className="row alert alert-secondary my-2">
            <AddForm
              newDiscription={newList}
              setNewDiscription={setNewList}
              addPdca={addList}
            />
          </div>
        )}
        <ul className="list-unstyled">
          {listData.map((item) => (
            <li key={item._id} className="mb-2">
              <Card
                item={item}
                userId={userId}
                editing={editing}
                deleteList={deleteList}
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
