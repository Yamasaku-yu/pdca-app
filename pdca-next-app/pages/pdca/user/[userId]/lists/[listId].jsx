import { useEffect, useState } from "react";
import AlertButton from "../../../components/add/alertButton";
import StageSelect from "../../../components/add/stageSelect";
import AddForm from "../../../components/add/addForm";
import EStageSelect from "../../../components/edit/eStageSelect";
import EditForm from "../../../components/edit/editForm";
import SaveButton from "../../../components/edit/saveButton";
import DeleteButton from "../../../components/edit/deleteButton";
import CardContent from "../../../components/edit/cardContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import Navbar from "../../../components/navbar";

export default function Home() {
  const router = useRouter();
  const { userId, listId } = router.query;
  const [pdcaData, setPdcaData] = useState([]);
  const [newStage, setNewStage] = useState("Plan");
  const [newDiscription, setNewDiscription] = useState("");
  const [editingid, setEditingid] = useState("");
  const [editedStage, setEditedStage] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [alertState, setAlertState] = useState(false);
  const [listName, setListName] = useState("");
  const [editing, setEditing] = useState(false);

  const stages = ["Plan", "Do", "Check", "Act"];

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = () => {
    fetch(`http://localhost:5000/api/pdca/user/${userId}/lists/${listId}`)
      .then((res) => res.json())
      .then((data) => {
        setPdcaData(data.pdcaData);
        setListName(data.listName);
      })
      .catch((err) => console.error("Error fetching PDCA data", err));
  };

  const addPdca = () => {
    fetch(`http://localhost:5000/api/pdca/user/${userId}/lists/${listId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage, description: newDiscription }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewStage("Plan");
        setNewDiscription("");
        fetchData();
      });
  };

  const handleEdit = (item) => {
    setEditingid(item._id);
    setEditedStage(item.stage);
    setEditedDescription(item.description);
  };

  const handleEditSave = (pdcaId, newStage, newDiscription) => {
    fetch(
      `http://localhost:5000/api/pdca/user/${userId}/lists/${listId}/${pdcaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage, description: newDiscription }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setEditingid(null);
        fetchData();
      });
  };

  const deletePdca = (pdcaId) => {
    fetch(
      `http://localhost:5000/api/pdca/user/${userId}/lists/${listId}/${pdcaId}`,
      {
        method: "DELETE",
      }
    ).then(() => {
      setEditingid(null);
      fetchData();
    });
  };

  return (
    <>
      <Navbar brandUrl={`pdca/user/${userId}`} />
      <div className="container">
        <h1 className="mt-2">{listName}</h1>

        <AlertButton
          alertState={alertState}
          setAlertState={setAlertState}
          setNameEditingId={setEditingid}
          setEditing={setEditing}
        />
        <button
          className="btn btn-secondary mx-1"
          onClick={() => {
            setEditing(!editing);
            setEditingid(null);
          }}
        >
          {editing ? "終了" : "編集"}
        </button>
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

        <div className="row">
          {pdcaData.map((item) => (
            <div className="col-6 col-sm-3" key={item._id}>
              <div className="card my-2">
                <div className="card-body">
                  {editingid === item._id ? (
                    <div>
                      <EStageSelect
                        editedStage={editedStage}
                        setEditedStage={setEditedStage}
                        stages={stages}
                      />
                      <EditForm
                        editedDescription={editedDescription}
                        setEditedDescription={setEditedDescription}
                        handleEditSave={handleEditSave}
                        item={item}
                        editedStage={editedStage}
                      />
                      <SaveButton
                        item={item}
                        editedStage={editedStage}
                        editedDescription={editedDescription}
                        handleEditSave={handleEditSave}
                      />
                      <DeleteButton deletePdca={deletePdca} item={item} />
                    </div>
                  ) : (
                    <CardContent
                      item={item}
                      editing={editing}
                      handleEdit={handleEdit}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
