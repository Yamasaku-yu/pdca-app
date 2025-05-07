import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import UserForm from "../components/userForm";
import Navbar from "../components/navbar";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const loginUser = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/pdca/user/${data.userId}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("ログイン時にエラーが発生しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Navbar brandUrl={`/pdca`}>

      </Navbar>
      {loading ? (
        <div>
          <h1>ログイン中...</h1>
        </div>) : (
        <UserForm
          title={"ログイン"}
          username={username}
          password={password}
          setPassword={setPassword}
          setUsername={setUsername}
          registerUser={loginUser}
          btnName={"ログイン"}
        />)}
      <footer className="bg-dark text-white text-center fixed-bottom">
        画面の一番下のフッター
      </footer>
    </div>
  );
}
