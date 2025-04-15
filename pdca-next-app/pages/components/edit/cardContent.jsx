import styles from "../../styles/Card.module.css";

export default function CardContent({
  item,
  handleEditSave,
  divRef,
  handleCardInput,
  setEditedDiscription,
  addTodo,
  editingId,
  setEditingId,
}) {
  return (
      <div onFocus={setEditingId(item._id)}>
        <div className="row mb-1">
          <h6 className="col-11">{item?.stage}</h6>
          {editingId === item._id && <button className="btn">×</button>}
        </div>
        {item.stage === "Do" ? (
          <>
            <div>
              <ul>
                {item.todos.map((todo) => (
                  <li
                    className={styles.myDiv}
                    onBlur={() => editTodo(item._id, todo._id)}
                  >
                    {todo.discription}
                  </li>
                ))}
              </ul>
            </div>
            {editingId === item._id && (
              <button className="btn" onClick={addTodo(item._id)}>
                +
              </button>
            )}
          </>
        ) : (
          <div
            className={styles.myDiv}
            onBlur={() => handleEditSave(item?._id, item.stage)}
            contentEditable
            ref={divRef}
            suppressContentEditableWarning={true}
            onInput={handleCardInput}
            onFocus={() => setEditedDiscription(item?.discription)}
          >
            {item?.description}
          </div>
        )}
      </div>
  );
}
