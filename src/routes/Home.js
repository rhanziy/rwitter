import React, { useEffect, useState } from "react";
import { orderBy, query, addDoc, collection, serverTimestamp, onSnapshot } from "firebase/firestore";
import { dbService, storageService } from "../myBase";
import { v4 } from "uuid";
import Rweets from "../components/Rweets"
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

const Home = ({ userObj }) => {
  
    const [ rweet, setRweet ] = useState("");
    const [ rweets, setRweets ] = useState([]);
    const [ attachment , setAttachment ] = useState("");


    useEffect(()=>{
        const q = query(collection(dbService, "rweets"),
            // where('text', '==', 'hehe')  조건때려박기
            orderBy('createdAt', 'desc')
        );
        onSnapshot(q, snapshot => {
            const rweetArr = snapshot.docs.map( doc => ({
                id : doc.id,
                ...doc.data(),
            }));
            setRweets(rweetArr);
            
        });
    }, [])

    const onSubmit = async(e) =>{
        e.preventDefault();
        let attachmentUrl = "";
        if(attachment != ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const rweetObj = {
            text : rweet,
            createdAt: serverTimestamp(),
            creatorId : userObj.uid,
            attachmentUrl
        }
        await addDoc(collection(dbService, "rweets"), rweetObj);
        setAttachment("");
        setRweet("");
    }

    const onChange = (e) =>{
        const { value } = e.target;
        setRweet(value);
    }
    
    const onFileChange = (e) => {
        const { files } = e.target;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const { result } = e.currentTarget;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearPhoto = () => setAttachment("");

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    value={ rweet }
                    onChange = { onChange } 
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120} 
                />
                <input type="file" accept="image/*" onChange={ onFileChange } />    
                <input type="submit" value="rweet"/>
                { attachment && 
                    <div>
                        <img src={ attachment } width="50px" height="50px" />
                        <button onClick={ onClearPhoto }> ✖ </button>
                    </div>
                }
            </form>
            <div>
                {rweets.map(e => (
                    <Rweets 
                        key = {e.id} 
                        rweetObj={e} 
                        isOwner = { e.creatorId === userObj.uid } 
                    /> 
                ))}
            </div>
        </div>
    );
}
export default Home;