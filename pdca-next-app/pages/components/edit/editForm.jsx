export default function EditForm({editedDescription,setEditedDescription,handleEditSave,item,editedStage}) {
    return (
        <input
        className="form-control mb-1"
        type="text"
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          handleEditSave(item?._id, editedStage, editedDescription)
        }
      />
    )
}