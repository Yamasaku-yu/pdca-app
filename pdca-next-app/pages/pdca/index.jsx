import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";

export default function Home() {

const alertMes = () => {
  alert("ログインしてください。")
}

  return (
    <>
      <Navbar brandUrl={`pdca`} />
      <div className="container">
        <h1>PDCAフォルダ</h1>
        <button className="btn btn-dark" onClick={alertMes}>新規追加</button>
      </div>
    </>
  );
}
