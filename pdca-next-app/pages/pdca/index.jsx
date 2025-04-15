import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import styles from "../styles/Card.module.css";

export default function Home() {

const alertMes = () => {
  alert("ログインしてください。")
}

  return (
    <>
      <Navbar brandUrl={`pdca`} />
      <div className="container">
        <h1>PDCAフォルダ</h1>
        <button className={`btn ${styles.bgDark}`} onClick={alertMes}>新規追加</button>
      </div>
    </>
  );
}
