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
  liRef,
  todoInput,
  todoDiscription,
  setTodoDiscription,
  editTodo,
  editedDiscription,
  deletePdca,
  deleteTodo,
  editCheck
}) {
  return (
    <div className="card my-2">
      <div className="card-body position-relative">
        <div className="row mb-1">
          <h6 className="col">{item?.stage}</h6>
          {editingId === item?._id && (
            <button
              className={`btn btn-lg col-auto py-0 pe-2 position-absolute top-0 end-0 ${styles.myBtn}`}
              onClick={() => deletePdca(item?._id)}
            >
              ×
            </button>
          )}
        </div>
        {item?.stage === "Do" ? (
          <>
            <div>
              {item.todos.map((todo) => (
                <div className="row">
                  <div className="form-check col-auto pe-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={todo?.check}
                      onChange={() => {
                        editCheck(item?._id,todo?._id,!todo?.check);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div
                    className={`${styles.myDiv} col px-0`}
                    onBlur={() => editTodo(item?._id, todo?._id,todoDiscription)}
                    contentEditable
                    ref={liRef}
                    suppressContentEditableWarning={true}
                    onInput={todoInput}
                    onFocus={() => setTodoDiscription(todo?.discription)}
                  >
                    {todo?.discription}
                  </div>
                  {editingId === item?._id && (
                    <button
                      className={`col-auto btn btn-lg pe-2 py-0 ${styles.myBtn}`}
                      onClick={() => deleteTodo(item?._id, todo?._id)}
                    >
                      ー
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editingId === item?._id && (
              <div className="row">
                <button
                  className={`btn btn-lg col-auto px-0 py-0 ${styles.myBtn}`}
                  onClick={() => addTodo(item?._id)}
                >
                  +
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className={styles.myDiv}
            onBlur={() =>
              handleEditSave(item?._id, item?.stage, editedDiscription)
            }
            contentEditable
            ref={divRef}
            suppressContentEditableWarning={true}
            onInput={handleCardInput}
            onFocus={() => setEditedDiscription(item?.discription)}
          >
            {item?.discription}
          </div>
        )}
      </div>
    </div>
  );
}
