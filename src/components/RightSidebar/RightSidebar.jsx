import React, { useContext, useEffect, useState } from "react";
import './RightSidebar.css';
import assets from '../../assets/assets.js';
import { logout } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";

const RightSidebar = () => {
    const { chatUser, messages } = useContext(AppContext);
    const [msgImages, setMsgImages] = useState([]);

    useEffect(() => {
        let tempVar = [];
        messages.map((msg) => { // 'msg' is now defined here
            if (msg.image) {
                tempVar.push(msg.image);
            }
        });
        setMsgImages(tempVar);
    }, [messages]);

    return chatUser ? (
        <div className="rs">
            <div className="rs-profile">
                <img src={chatUser.userData.avatar} alt="" />
                <h3>
                    {chatUser.userData.name}
                    {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
                        <img className="dot" src={assets.green_dot} alt="" />
                    ) : null}
                </h3>
                <p>{chatUser.userData.bio}</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div>
                    {msgImages.map((url, index) => (
                        <img onClick={() => window.open(url)} key={index} src={url} alt="" />
                    ))}
                </div>
            </div>
            <button onClick={() => logout()}>Logout</button>
        </div>
    ) : (
        <div className="rs">
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

export default RightSidebar;
