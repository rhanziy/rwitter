import React, { useEffect, useState } from "react";
import { orderBy, query, addDoc, collection, serverTimestamp, onSnapshot } from "firebase/firestore";
import { dbService } from "../myBase";

const Home = ({ userObj }) => {
    const [ rweet, setRweet ] = useState("");
    const [ rweets, setRweets ] = useState([]);

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
        await addDoc(collection(dbService, "rweets"), { 
            text : rweet,
            createdAt: serverTimestamp(),
            creatorId : userObj.uid,
        });
        setRweet("");
    }
    const onChange = (e) =>{
        const { value } = e.target;
        setRweet(value);
    }


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
                <input type="submit" value="rweet"/>
            </form>
            <div>
                {rweets.map(e => 
                    <div key={e.id}>
                        <h4>{ e.text }</h4>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Home;