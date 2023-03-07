import React, { useEffect } from "react";
import { authService, dbService } from "../myBase";
import { useHistory } from "react-router-dom";
import { query, collection, onSnapshot, where, getDoc } from "@firebase/firestore";



const Profile = ({ userObj }) => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/")
    }
    const getMyRweets = async() => {
        const q = query(
            collection(dbService, "rweets"),
            where("creatorId", "==", `${userObj.uid}`)
        );
        const unSubscribe = await onSnapshot(q, (snapshot) => {
            const newArry = snapshot.docs.forEach((e)=>{
                console.log(e.id, "=>", e.data());
            })
        });
    }
    useEffect(()=>{
        getMyRweets();
    }, [userObj])

    return(
        <>
            <button onClick={onLogOutClick}>
                Log Out
            </button>
        </>
    )
};

export default Profile;