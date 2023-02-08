import React, { useState } from "react";
import { dbService } from "../myBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { async } from "@firebase/util";


const Rweets = ({ rweetObj, isOwner }) => {
    const RweetTextRef = doc(dbService, "rweets", rweetObj.id);
    const [editing, setEditing] = useState(false);
    const [newRweet, setNewRweet] = useState(rweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this rweet?");
        if (ok) {
            await deleteDoc(RweetTextRef);
        }
    }

    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async(e) => {
        e.preventDefault();
        await updateDoc( RweetTextRef, {
            text : newRweet
        });
        setEditing(false);
    }
    const onChange = (e) => {
        const { value } = e.target;
        setNewRweet(value);
    }
    return (
        <div>
            {
                editing ?
                    <>
                        <form onSubmit={ onSubmit }>
                            <input 
                                text="text" 
                                placeholder="Edit your rweet" 
                                value={ newRweet }
                                onChange = { onChange }
                                require="true"
                            />
                            <input type="submit" value="update rweet"></input>
                        </form>
                        <button onClick={toggleEditing}>Cancle</button>
                    </>
                    : <>
                        <h4>{rweetObj.text}</h4>
                        {
                            isOwner && (
                                <>
                                    <button onClick={onDeleteClick}>❌</button>
                                    <button onClick={toggleEditing}>🖊</button>
                                </>
                            )
                        }
                    </>
            }
        </div>
    );
};



export default Rweets;