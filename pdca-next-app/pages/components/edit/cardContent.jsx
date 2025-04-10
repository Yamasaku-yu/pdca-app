export default function CardContent({item, editing,handleEdit }) {
  return (
    <div>
      <div>
        <div className="row mb-1">
          <h5 className="col">{item?.stage}</h5>
          {editing ? (
            <button className="btn btn-sm btn-outline-secondary col-auto" onClick={()=>handleEdit(item)}>
              編集
            </button>
          ) : null}
        </div>
        <h6>{item?.description}</h6>
      </div>
    </div>
  );
}
