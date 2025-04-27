import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState,ReactNode } from "react";
import { useRouter } from "next/router";

type Props = {
  brandUrl:string;
  children?:ReactNode;
}

const Navbar:React.FC<Props> = ({ brandUrl,children }) => {
  const router = useRouter();
  const [session, setSession] = useState<string>();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/session`, {
      method: "GET",
      credentials: "include", // クッキーを送信するために必須
    })
      .then((res) => res.json())
      .then((data) => {
        setSession(data.session);
        console.log(data.session);
      })
      .catch((err) => console.error("Error fetching PDCA data", err));
  };

  const logout = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/pdca/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (response.ok) {
      const data = await response.json();
      setSession(data.session);
      router.push("/pdca/login");
    }
  };
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <nav className="navbar navbar-expand-lg bg-secondary navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href={`${brandUrl}`}>
          PDCA
        </a>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          {session ? (
            <ul className="navbar-nav d-flex w-100">
              {children}
              <li className="nav-item ms-lg-auto">
                <button className="btn btn-link nav-link" onClick={logout}>
                  ログアウト
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/pdca/register">
                  ユーザー登録
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/pdca/login">
                  ログイン
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;