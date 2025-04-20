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
  const [editingId, setEditingId] = useState("");
  const [editedDiscription, setEditedDiscription] = useState("");
  const [alertState, setAlertState] = useState(false);
  const [listName, setListName] = useState("");
  const [editing, setEditing] = useState(false);
  const [todoDiscription, setTodoDiscription] = useState("");
  const divRef = useRef(null);
  const liRef = useRef(null);

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

  const addPdca = (stage) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, discription: "" }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setNewStage("Plan");
        fetchData();
      });
  };

  const handleCardInput = () => {
    if (divRef.current) {
      setEditedDiscription(divRef.current.innerText);
    }
  };

  const todoInput = () => {
    if (liRef.current) {
      setTodoDiscription(liRef.current.innerText);
    }
  };

  const handleEditSave = (pdcaId, stage, discription) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stage, discription: discription }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setEditedDiscription("");
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
        body: JSON.stringify({ discription: "", check: false }),
      }
    ).then(() => fetchData());
  };

  const editTodo = (pdcaId, todoId, discription) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}/${todoId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discription }),
      }
    ).then(() => fetchData());
  };

  const editCheck = (pdcaId, todoId, check) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}/${todoId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check }),
      }
    ).then(() => fetchData());
  };

  const deleteTodo = (pdcaId, todoId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}/${todoId}`,
      {
        method: "DELETE",
      }
    ).then(() => fetchData());
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
      </Navbar>{" "}
      <div className="min-vh-100" onClick={() => setEditingId("")}>
        <div className="container">
          <h3 className="mt-3">{listName}</h3>
          <div className="row">
            <div className="col-auto my-2">
              <StageSelect
                newStage={newStage}
                setNewStage={setNewStage}
                stages={stages}
              />
            </div>
            <div className="col-auto my-2">
              <button
                className={`btn ${styles.bgDark}`}
                onClick={() => addPdca(newStage)}
              >
                追加
              </button>
            </div>
          </div>
          {pdcaData.map((item) => (
            <div
              className=""
              key={item?._id}
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(item?._id);
              }}
            >
              <CardContent
                handleEditSave={handleEditSave}
                divRef={divRef}
                handleCardInput={handleCardInput}
                item={item}
                editing={editing}
                styles={styles}
                editedDiscription={editedDiscription}
                setEditedDiscription={setEditedDiscription}
                editingId={editingId}
                setEditingId={setEditingId}
                liRef={liRef}
                todoInput={todoInput}
                todoDiscription={todoDiscription}
                setTodoDiscription={setTodoDiscription}
                editTodo={editTodo}
                addTodo={addTodo}
                deletePdca={deletePdca}
                deleteTodo={deleteTodo}
                editCheck={editCheck}
              />
            </div>
          ))}
        </div>
        <footer className="bg-dark text-white text-center fixed-bottom">
          画面の一番下のフッター
        </footer>
      </div>
    </>
  );
}
