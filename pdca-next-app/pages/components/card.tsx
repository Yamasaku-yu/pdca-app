import Link from "next/link";
import styles from "../styles/Card.module.css";

type Props = {
  item:{_id:string;name:string};
  userId?:string|string[];
  editing:boolean;
  deleteFolder:(folderId:string)=>Promise<void>;
  nameEditingId:string;
  setNameEditingId:React.Dispatch<React.SetStateAction<string>>;
  nameChange:(folderId:string)=>Promise<void>;
  editedName:string;
  setEditedName:React.Dispatch<React.SetStateAction<string>>;
}

const Card:React.FC<Props> = ({
  item,
  userId,
  editing,
  deleteFolder,
  nameEditingId,
  setNameEditingId,
  nameChange,
  editedName,
  setEditedName,
}) => {
  return (
    <Link
      className={`card text-decoration-none ${styles.white}`}
      href={editing ? "#" : `/pdca/user/${userId}/folders/${item?._id}`}
      onClick={(e)=>e.stopPropagation()}
    >
      <div className="card-body row">
        {nameEditingId === item?._id ? (
          <input
            className="form-control col text-start"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <div className="col text-start"> {item?.name}</div>
        )}
        {editing ? (
          <div className="col text-end">
            <div className="row justify-content-end">
              <div className="col">
                {nameEditingId === item?._id ? (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={editedName?() => nameChange(item?._id):undefined}
                  >
                    決定
                  </button>
                ) : (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => {
                      setNameEditingId(item?._id);
                      setEditedName(item?.name);
                    }}
                  >
                    名前変更
                  </button>
                )}
              </div>
              <div className="col-sm-2 col-3">
                <button
                  className="btn btn-outline-dark btn-sm"
                  style={{ "--bs-btn-padding-y": " .1000rem" } as React.CSSProperties}
                  onClick={() => deleteFolder(item?._id)}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default Card;