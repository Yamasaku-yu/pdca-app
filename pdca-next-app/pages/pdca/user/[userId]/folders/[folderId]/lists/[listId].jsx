import { useEffect, useState, useRef } from "react";
import AlertButton from "../../../../../../components/add/alertButton";
import StageSelect from "../../../../../../components/add/stageSelect";
import AddForm from "../../../../../../components/add/addForm";
import EStageSelect from "../../../../../../components/edit/eStageSelect";
import EditForm from "../../../../../../components/edit/editForm";
import SaveButton from "../../../../../../components/edit/saveButton";
import DeleteButton from "../../../../../../components/edit/deleteButton";
import CardContent from "../../../../../../components/edit/cardContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import Navbar from "../../../../../../components/navbar";
import styles from "../../../../../../styles/Card.module.css";

export default function Pdca() {
  const router = useRouter();
  const { userId, folderId, listId } = router.query;
  const [pdcaData, setPdcaData] = useState([]);
  const [newStage, setNewStage] = useState("Plan");
  const [newDiscription, setNewDiscription] = useState("");
  const [editingId,setEditingId] = useState("");
  const [editedDiscription, setEditedDiscription] = useState("");
  const [alertState, setAlertState] = useState(false);
  const [listName, setListName] = useState("");
  const [editing, setEditing] = useState(false);
  const divRef = useRef(null);

  const stages = ["Plan", "Do", "Check", "Act"];

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPdcaData(data.pdcaData);
        setListName(data.listName);
      })
      .catch((err) => console.error("Error fetching PDCA data", err));
  };

  const addPdca = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage, description: newDiscription }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setNewStage("Plan");
        setNewDiscription("");
        fetchData();
      });
  };

  const handleCardInput = () => {
    if (divRef.current) {
      setEditedDiscription(divRef.current.innerText);
    }
  };

  const handleEditSave = (pdcaId, stage) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stage, description: editedDiscription }),
      }
    )
      .then((res) => res.json())
      .then(() => {
       setEditingId(null);
       setEditedDiscription("")
        fetchData();
      });
  };

  const deletePdca = (pdcaId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "DELETE",
      }
    ).then(() => {
     setEditingId(null);
      fetchData();
    });
  };

  const addTodo = (pdcaId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "" }),
      }
    ).then(()=>fetchData());
  };

  return (
    <>
      <Navbar brandUrl={`pdca/user/${userId}`} />
      <div className="container">
        <h3 className="mt-3">{listName}</h3>
        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setNameEditingId={setEditingid}
          setEditing={setEditing}
        />
        {alertState ? (
          <div className="row alert alert-secondary my-2">
            <StageSelect
              newStage={newStage}
              setNewStage={setNewStage}
              stages={stages}
            />
            <AddForm
              newDiscription={newDiscription}
              setNewDiscription={setNewDiscription}
              addPdca={addPdca}
            />
          </div>
        ) : (
          <></>
        )}

        {pdcaData.map((item) => (
          <div className="" key={item?._id}>
            <div className="card my-2">
              <div className="card-body">
                <CardContent
                  handleEditSave={handleEditSave}
                  divRef={divRef}
                  handleCardInput={handleCardInput}
                  item={item}
                  editing={editing}
                  handleEdit={handleEdit}
                  styles={styles}
                  editedDiscription={editedDiscription}
                  setEditedDiscription={setEditedDiscription}
                  editingId={editingId}
                  setEditingId={setEditingId}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
