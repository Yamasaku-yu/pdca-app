export default function DeleteButton({deletePdca,item}) {
  return (
    <button
      className="btn btn-secondary ms-1 my-1"
      onClick={() => deletePdca(item?._id)}
    >
      削除
    </button>
  );
}
