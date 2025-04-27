import { useEffect, useState, useRef } from "react";
import StageSelect from "../../../../../../components/add/stageSelect";
import CardContent from "../../../../../../components/cardContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import Navbar from "../../../../../../components/navbar";
import styles from "../../../../../../styles/Card.module.css";

type TodoType = {
  _id: string;
  check: boolean;
  discription: string;
}

type PdcaType = {
  _id:string;
  stage:string;
  discription:string;
  todos:TodoType[]
}

export default function Pdca() {
  const router = useRouter();
  const { userId, folderId, listId } = router.query;
  const [pdcaData, setPdcaData] = useState<PdcaType[]>([]);
  const [newStage, setNewStage] = useState<string>("Plan");
  const [editingId, setEditingId] = useState<string>("");
  const [editedDiscription, setEditedDiscription] = useState<string>("");
  const [listName, setListName] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [todoDiscription, setTodoDiscription] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);
  const liRef = useRef<HTMLDivElement>(null);

  const stages = ["Plan", "Do", "Check", "Action"];

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = () => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPdcaData(data.pdcaData);
        setListName(data.listName);
      })
      .catch((err) => console.error("Error fetching PDCA data", err));
  };

  const addPdca = (stage:string) => {
    return fetch(
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

  const handleEditSave = (pdcaId:string, stage:string, discription:string) => {
    return fetch(
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

  const deletePdca = (pdcaId:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "DELETE",
      }
    ).then(() => {
      setEditingId("");
      fetchData();
    });
  };

  const addTodo = (pdcaId:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discription: "", check: false }),
      }
    ).then(() => fetchData());
  };

  const editTodo = (pdcaId:string, todoId:string, discription:string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}/${todoId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discription }),
      }
    ).then(() => fetchData());
  };

  const editCheck = (pdcaId:string, todoId:string, check:boolean) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/user/${userId}/folders/${folderId}/lists/${listId}/${pdcaId}/${todoId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check }),
      }
    ).then(() => fetchData());
  };

  const deleteTodo = (pdcaId:string, todoId:string) => {
    return fetch(
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
                editedDiscription={editedDiscription}
                setEditedDiscription={setEditedDiscription}
                editingId={editingId}
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
