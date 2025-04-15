import styles from "../../styles/Card.module.css"

export default function AddForm({newDiscription,setNewDiscription,addPdca}) {
  return (
    <div className="col">
      <input
        className="form-control mb-2"
        type="text"
        placeholder="入力してください"
        value={newDiscription}
        onChange={(e) => setNewDiscription(e.target.value)}
      />
      <button className={`btn ${styles.bgDark}`} onClick={newDiscription?addPdca:undefined
      }>
        追加
      </button>
    </div>
  );
}
