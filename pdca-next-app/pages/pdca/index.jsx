import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import styles from "../styles/Card.module.css";

export default function Home() {
  const alertMes = () => {
    alert("ログインしてください。");
  };

  return (
    <>
      <Navbar brandUrl={`/pdca`}>
      </Navbar>
      <div className="container">
        <h1>PDCAフォルダ</h1>
        <button className={`btn ${styles.bgDark}`} onClick={alertMes}>
          新規追加
        </button>
      </div>
      <footer className="bg-dark text-white text-center fixed-bottom">
        画面の一番下のフッター
      </footer>
    </>
  );
}
