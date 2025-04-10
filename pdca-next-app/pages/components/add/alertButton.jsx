export default function AlertButton({alertState,setAlertState,setEditing,setNameEditingId}) {
    return (
        <button
          className="btn btn-dark my-2"
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