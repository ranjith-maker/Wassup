
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        // Stores messages grouped by conversation partner id
        conversations: {},

        // Optional: track unread messages later
        unreadCounts: {}
    },

    reducers: {

        // When opening a chat, load messages from backend
        setMessages: (state, action) => {
            const { userId, messages } = action.payload;

            state.conversations[userId] = messages;
        },


        // Add my own sent message immediately
        appendSentMessage: (state, action) => {

            const message = action.payload;

            const receiverId =
                message.receiver?._id || message.receiver;

            if (!state.conversations[receiverId]) {
                state.conversations[receiverId] = [];
            }

            state.conversations[receiverId].push(message);
        },


        // Handle incoming socket messages
        IncomingMessage: (state, action) => {

            const message = action.payload;

            const senderId =
                message.sender?._id || message.sender;


            if (!state.conversations[senderId]) {
                state.conversations[senderId] = [];
            }

            state.conversations[senderId].push(message);


            // Increase unread count
            state.unreadCounts[senderId] =
                (state.unreadCounts[senderId] || 0) + 1;
        },


        // Clear a particular conversation
        clearConversation: (state, action) => {

            const userId = action.payload;

            delete state.conversations[userId];
            delete state.unreadCounts[userId];
        },


        // Clear everything on logout
        clearMessages: (state) => {

            state.conversations = {};
            state.unreadCounts = {};
        },


        // Reset unread badge after opening chat
        clearUnread: (state, action) => {

            const userId = action.payload;

            state.unreadCounts[userId] = 0;
        }
    }
});


export const {
    setMessages,
    appendSentMessage,
    IncomingMessage,
    clearConversation,
    clearMessages,
    clearUnread

} = chatSlice.actions;


export default chatSlice.reducer;
