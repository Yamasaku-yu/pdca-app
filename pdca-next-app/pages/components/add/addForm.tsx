import styles from "../../styles/Card.module.css";

type Props = {
  newDiscription: string;
  setNewDiscription: React.Dispatch<React.SetStateAction<string>>;
  addPdca: () => Promise<void>
}

const AddForm: React.FC<Props> = ({
  newDiscription,
  setNewDiscription,
  addPdca,
}) => {
  return (
    <div className="col-auto">
      <div className="row">
        <div className="col-auto">
          <input
            className="form-control"
            type="text"
            placeholder="入力してください"
            value={newDiscription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDiscription(e.target.value)}
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

export default AddForm;
