import AppRouter from "../components/Router";
import { useEffect, useState } from "react";
import { authService } from "../myBase"

function App() {
  const [ init, setInit ] = useState(false);
  const [ userObj, setUserObj ] = useState(null);

  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        setUserObj(user);
      }
      setInit(true);
    })
  }, [])
  return (
    <>
      { init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={ userObj } /> : "Initializing...." }
    </>
  );
}

export default App;
