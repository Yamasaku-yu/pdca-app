type Props = {
  newStage: string;
  setNewStage: React.Dispatch<React.SetStateAction<string>>;
  stages: string[]
}

const StageSelect: React.FC<Props> = ({ newStage, setNewStage, stages }) => {
  return (
    <div className="col-auto">
      <select
        className="form-select"
        value={newStage}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStage(e.target.value)}
      >
        {stages?.map((stage) => (
          <option value={stage} key={stage}>
            {stage}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StageSelect;