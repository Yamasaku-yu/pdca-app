export default function SaveButton({item,handleEditSave,editedStage,editedDescription}) {
  return (
    <button
      className="btn btn-dark ms-sm-1"
      onClick={() => handleEditSave(item?._id, editedStage, editedDescription)}
    >
      保存
    </button>
  );
}
