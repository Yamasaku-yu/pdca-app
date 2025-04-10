export default function EStageSelect({ editedStage, setEditedStage, stages }) {
  return (
    <select
      className="form-select mb-1"
      value={editedStage}
      onChange={(e) => {
        setEditedStage(e.target.value);
      }}
    >
      {stages?.map((stage) => (
        <option value={stage} key={stage}>
          {stage}
        </option>
      ))}
    </select>
  );
}
