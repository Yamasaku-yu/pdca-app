
type Props = {
  title:string;
  username:string;
  password:string;
  setUsername:React.Dispatch<React.SetStateAction<string>>;
  setPassword:React.Dispatch<React.SetStateAction<string>>;
  registerUser:()=>Promise<void>;
  btnName:string;
}

const UserForm:React.FC<Props> = ({title,username,password,setUsername,setPassword,registerUser,btnName}) => {
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
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      ></input>
      <button className="btn btn-dark mt-3" onClick={registerUser}>
        {btnName}
      </button>
    </div>
  );
}

export default UserForm;