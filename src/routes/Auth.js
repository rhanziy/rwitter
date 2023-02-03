import React, { useState } from "react";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GithubAuthProvider, 
    GoogleAuthProvider,
    signInWithPopup
 } from "firebase/auth";
import { authService } from "../myBase";


const Auth = () => {
    const [ email, setEmail ] = useState("");
    const [ pass, setPass ] = useState("");
    const [ newAccount, setNewAccount ] = useState(true);
    const [ error, setError ] = useState("");

    const onChange = (e) =>{
        const { name, value } = e.target;
        if(name === "email"){
            setEmail(value);
        }else if(name === "pass"){
            setPass(value);
        }
    }
    const onSubmit = async(e)=>{
        e.preventDefault();
        try {
            let data;
            if(newAccount){
                data = await createUserWithEmailAndPassword(authService, email, pass);
            } else {
                data = await signInWithEmailAndPassword(authService, email, pass);
            }
        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev)
    const onSocialClick = async(e) => {
        const { name } = e.target;
        let provider;
        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="email" 
                    type="text" 
                    placeholder="Email" 
                    required value={email}
                    onChange={onChange}
                />
                <input 
                    name ="pass" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={pass}
                    onChange={onChange}
                />
                <input type="submit" value={ newAccount ? "Create Account" : "Sign In" } />
                { error }
            </form>
            <span onClick={toggleAccount}>{ newAccount ? "Sign in" : "Create Account" }</span>
            <button name="google" onClick={onSocialClick}>Continue with Google</button>
            <button name="github" onClick={onSocialClick}>Continue with Github</button>
        </div>  
    )


}

export default Auth;