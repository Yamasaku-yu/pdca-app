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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      router.push(`/pdca/user/${data.userId}`);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <Navbar brandUrl={`/pdca`}>
        
      </Navbar>
      <UserForm
        title={"ユーザー登録"}
        username={username}
        password={password}
        setPassword={setPassword}
        setUsername={setUsername}
        registerUser={registerUser}
        btnName={"登録"}
      />
      <footer className="bg-dark text-white text-center fixed-bottom">
        画面の一番下のフッター
      </footer>
    </div>
  );
}
