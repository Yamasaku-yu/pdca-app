import styles from "../../styles/Card.module.css"

export default function AlertButton({alertState,setAlertState,setEditing,setNameEditingId}) {
    return (
        <button
          className={`btn my-2 ${styles.bgDark}`}
          onClick={() => {
            setAlertState(!alertState);
            setEditing(false);
            setNameEditingId("");
          }}
        >
          {alertState ? "閉じる" : "新規追加"}
        </button>
    )
}