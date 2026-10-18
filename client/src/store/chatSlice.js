
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        // Stores messages grouped by conversation partner id
        conversations: {},
    },

    reducers: {

        // When opening a chat, load messages from backend,When a user opens a chat, I fetch the previous conversation from the backend. 
        // The backend returns an array of objs messages.
        //  I store that array under the selected user's ID.
        setMessages: (state, action) => {
            const { userId, messages } = action.payload;

            state.conversations[userId] = messages;
        },


        // Add my own sent message immediately
        //When I send a message, I don't wait for another API call to reload the conversation.
        // I immediately append the sent message object into the corresponding conversation array, so the UI updates instantly
        //conversations: {  tanyaId: [msg1, msg2, newMessage] }
        appendSentMessage: (state, action) => {
            //msgs object    
            const message = action.payload;

            const receiverId =
                message.receiver?._id || message.receiver;

            if (!state.conversations[receiverId]) {
                state.conversations[receiverId] = [];
            }

            state.conversations[receiverId].push(message);
        },
     //checking whether a conversation array already exists for that user. 
     // If it does not exist, you create a new empty array for that new chat.

        // Handle incoming socket messages
        IncomingMessage: (state, action) => {

            const message = action.payload;

            const senderId =
                message.sender?._id || message.sender;


            if (!state.conversations[senderId]) {
                state.conversations[senderId] = [];
            }

            state.conversations[senderId].push(message);

        },
//This avoids searching through one large messages array every time a user opens a chat. 
// I can directly access conversations[selectedUserId] and get that user's messages

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


    }
});


export const {
    setMessages,
    appendSentMessage,
    IncomingMessage,
    clearConversation,
    clearMessages,
    

} = chatSlice.actions;


export default chatSlice.reducer;



/**
 * So in this line:
state.conversations[receiverId].push(message);
state.conversations[receiverId] is the array.
message is the object being added to that array.
 * {
    conversations: {
       receiverId: [
            {
                _id: "m1",
                sender: { _id: "A" },
                receiver: { _id: "B" },
                content: "Hello"
            }
        ]

    }
}
 * 
conversations
│
├── "B" ─────► [
│                message1,
│                message2,
│                message3,
                newMessage
│             ]
│
└── "C" ─────► [
                 message4,
                 message5
              ]
Each key is a userID.
Each value is that user's chat history.

conversations = {
    "111": [...],
    "222": [...],
    "333": [...]
}


 */