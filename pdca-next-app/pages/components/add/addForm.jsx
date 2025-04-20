import styles from "../../styles/Card.module.css";

export default function AddForm({
  newDiscription,
  setNewDiscription,
  addPdca,
}) {
  return (
    <div className="col-auto">
      <div className="row">
        <div className="col-auto">
          <input
            className="form-control"
            type="text"
            placeholder="入力してください"
            value={newDiscription}
            onChange={(e) => setNewDiscription(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button
            className={`btn ${styles.bgDark}`}
            onClick={newDiscription ? addPdca : undefined}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
