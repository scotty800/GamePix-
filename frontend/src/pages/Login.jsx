import LoginRegister from "../components/LoginRegister";
import "../style/LoginRegister.css";
import LogoGamepix from "../assets/images/LogoGamepix.png";

function Login() {
  return (

    <div className='background'>
      <img src={LogoGamepix} alt="logo" className="logo"></img>
      <LoginRegister />
    </div>
  );
}

export default Login;