import React from "react";
import styles from "../../styles/Card.module.css";

type Props = {
  alertState: boolean;
  setAlertState: React.Dispatch<React.SetStateAction<boolean>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNameEditingId: React.Dispatch<React.SetStateAction<string>>;
}

const AlertButton: React.FC<Props> = ({ alertState, setAlertState, setEditing, setNameEditingId }) => {
  return (
    <button
      className={`btn my-2 ${styles.bgDark}`}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAlertState(!alertState);
        setEditing(false);
        setNameEditingId("");
      }}
    >
      {alertState ? "閉じる" : "新規追加"}
    </button>
  )
}

export default AlertButton;