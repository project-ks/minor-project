import React, { useEffect } from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from '../../assets/user.svg'
function Header() {

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");

    }
  }, [user, loading, navigate])


  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          navigate("/");
          toast.success("Logged out Successfully!");
      })
        .catch((error) => {
        toast.error(error.messaage);
      })
    } catch (e) {
      toast.error(e.messaage);
    }
    // alert("Logout")
  }
  return (
    <div className='navbar'>
      <p className='logo'>Budget Tracker</p>
      {user && (
        <div style={{display:"flex", alignItems: "center", gap:"1rem"}}>
          <img src={user.photoURL?user.photoURL: userImg} style={{height:"2.5rem", width:"2.5rem",borderRadius: "50%"}} alt="user-pic"/>
        <p className='logo link' onClick={logoutFnc}>Logout</p>
        </div>

      )}
    </div>
  )
}

export default Header