export default function UserForm({title,username,password,setUsername,setPassword,registerUser,btnName}) {
  return (
    <div className="container">
      <h1 className="mt-3">{title}</h1>
      <label className="form-label" htmlFor="username">
        UserName
      </label>
      <input
        className="form-control"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="inputPassword5" className="form-label">
        Password
      </label>
      <input
        type="password"
        id="inputPassword5"
        className="form-control"
        aria-labelledby="passwordHelpBlock"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button className="btn btn-dark mt-3" onClick={registerUser}>
        {btnName}
      </button>
    </div>
  );
}
