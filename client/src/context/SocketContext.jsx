import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { IncomingMessage } from '../store/chatSlice';
import { BASEURL } from "../main";
import { setOnlineUsers, setUserData, updateUserProfileRealtime } from "../store/userSlice";


const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};



export const SocketProvider = ({ children }) => {

const [socket, setSocket] = useState(null);
const dispatch = useDispatch();

const { isAuthenticated, userData } = useSelector((state) => state.user);

useEffect(() => {
    let socketInstance = null;
//This allows cookies to be sent during the socket handshake. as backend expects the jwt token from cookies. it forces the client to use WebSocket transport instead of falling back to HTTP long polling.
    if (isAuthenticated) {
        socketInstance = io(BASEURL, {
            withCredentials: true,
            transports: ["websocket"],
        });

        setSocket(socketInstance);
//below all on is listen for the backend event:
        socketInstance.on("getOnlineUsers", (users) => {
            dispatch(setOnlineUsers(users));
        });

        socketInstance.on("newMessage", (message) => {
            const incomingSenderId = message.sender?._id || message.sender;
                //preventing showing my own messages
            if (incomingSenderId?.toString() === userData?._id?.toString()) {
                return;
            }

            dispatch(IncomingMessage(message));
        });

        socketInstance.on("user_profile_updated", (updatedUserData) => {
                dispatch(updateUserProfileRealtime(updatedUserData));
            });
    }

    return () => {
        socketInstance?.disconnect();
        setSocket(null);
    };
}, [isAuthenticated, userData?._id, dispatch]);

//dependcy so it runs when:login status changes logged-in user changes


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};


