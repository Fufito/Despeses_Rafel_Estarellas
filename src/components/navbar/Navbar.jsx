import { Link } from "react-router-dom"
import './Navbar.css'
import { logoutUser } from "../../firebase/firebase";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const logout = ()=>{
    console.log("logout");
    logoutUser()
      .then(
        setUserLoggedIn(false)
        //nagigate /home
      );
  }

  useEffect(()=>{
    //Cridar mètode per comprovar si usuari loguejat (isUserLoggedIn)
  }, []);


  return (
    <nav className="navbar">
        <ul>
        <li className="titol"><Link to="/">Rafel Despeses</Link></li>
        <li><Link to="/">Inici</Link></li>

        {!userLoggedIn &&
          (
            <>
              <li><Link to="/login">Accés</Link></li>
              <li><Link to="/register">Registrar-se</Link></li>
            </>
          )
        }
        
        {userLoggedIn &&
          (
            <li><Link onClick={ ()=> logout()}>Tancar sessió</Link></li>
          )
        }
        </ul>
    </nav>
  )
}
