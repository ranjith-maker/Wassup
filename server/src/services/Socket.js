import { createRequire } from "module";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";


const userSocketMap = new Map();

// FIX: Force the incoming query lookup key directly to a string primitive
export const getReceiverSocketId = (userId) => {
    if (!userId) return null;
    return userSocketMap.get(userId.toString());
};



export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
            credentials: true,
        },
    });

    io.use((socket, next) => {
   
        try {
            const reqCookies = socket.handshake.headers.cookie;
            if (!reqCookies) {
                return next(new Error("Authentication failed: Cookies missing"));
            }

           const token = reqCookies
           .split(";")
           .find(c => c.trim().startsWith("token="))
            ?.split("=")[1];


            if (!token) {
                return next(new Error("Authentication failed: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 🚀 FIX: Explicitly cast decoded token id to string here
            socket.userId = decoded.id.toString(); 
            
            next();
        } catch (error) {

        //   console.log("SOCKET AUTH ERROR:", error);

          return next(error);
}
    });

    io.on("connection", (socket) => {
        const userId = socket.userId; // Already string casted

        userSocketMap.set(userId, socket.id);
        console.log("SOCKET CONNECTED USER:", socket.userId );
        
         io.emit('getOnlineUsers', Array.from(userSocketMap.keys()) )

        socket.on("disconnect", () => {

            userSocketMap.delete(userId);

            io.emit('getOnlineUsers', Array.from(userSocketMap.keys()) )

            // console.log(`Disconnected: User [${userId}] removed`);

        
        });
    });

    return io;
};

