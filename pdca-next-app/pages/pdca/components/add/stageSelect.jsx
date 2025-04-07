export default function StageSelect({newStage,setNewStage,stages}) {
  return (
    <div className="col-auto">
      <select
        className="form-select"
        value={newStage}
        onChange={(e) => setNewStage(e.target.value)}
      >
        {stages.map((stage) => (
          <option value={stage} key={stage}>
            {stage}
          </option>
        ))}
      </select>
    </div>
  );
}
