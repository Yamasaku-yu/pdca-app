import { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import UserForm from "../components/userForm";
import Navbar from "../components/navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("ログインに失敗しました");
      }
      const data = await response.json();
      router.push(`/pdca/user/${data.userId}`);
    } catch (error) {
      console.error("エラー:", error.message);
      alert("ログインに失敗しました。もう一度試してください。");
    }
  };

  return (
    <div>
      <Navbar brandUrl={`pdca`} />
      <UserForm
        title={"ログイン"}
        username={username}
        password={password}
        setPassword={setPassword}
        setUsername={setUsername}
        registerUser={loginUser}
        btnName={"ログイン"}
      />
    </div>
  );
}
