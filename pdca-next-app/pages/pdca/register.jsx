import { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import UserForm from "../components/userForm";
import Navbar from "../components/navbar";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const registerUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("ユーザー登録に失敗しました");
      }
      const data = await response.json();
      router.push(`/pdca/user/${data.userId}`);
    } catch (error) {
      console.error("エラー:", error.message);
      alert("登録に失敗しました。もう一度試してください。");
    }
  };

  return (
    <div>
      <Navbar brandUrl={`pdca`} />
      <UserForm
        title={"ユーザー登録"}
        username={username}
        password={password}
        setPassword={setPassword}
        setUsername={setUsername}
        registerUser={registerUser}
        btnName={"登録"}
      />
    </div>
  );
}

