import Link from "next/link";
import styles from "../../styles/Card.module.css";

export default function Card({
  item,
  userId,
  editing,
  deleteList,
  nameEditingId,
  setNameEditingId,
  nameChange,
  editedName,
  setEditedName,
}) {
  return (
    <Link
      className={`card text-decoration-none ${styles.cardHover}`}
      href={editing ? "#" : `/pdca/user/${userId}/lists/${item._id}`}
    >
      <div className="card-body row">
        {nameEditingId === item._id ? (
          <input
            className="form-control col text-start"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <div className="col text-start"> {item.name}</div>
        )}
        {editing ? (
          <div className="col text-end">
            <div className="row justify-content-end">
              <div className="col">
                {nameEditingId === item._id ? (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={editedName?() => nameChange(item._id):undefined}
                  >
                    決定
                  </button>
                ) : (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => {
                      setNameEditingId(item._id);
                      setEditedName(item.name);
                    }}
                  >
                    名前変更
                  </button>
                )}
              </div>
              <div className="col-sm-2 col-3">
                <button
                  className="btn btn-outline-dark btn-sm"
                  style={{ "--bs-btn-padding-y": " .1000rem" }}
                  onClick={() => deleteList(item._id)}
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
