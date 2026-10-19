import { createRequire } from "module";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";


const userSocketMap = new Map();

//it finds the socket ID of a particular user., it returns a soclet of the user
export const getReceiverSocketId = (userId) => {
    if (!userId) return null;
    return userSocketMap.get(userId.toString());
};


//giving our http server to this websocket server, Only this frontend domain can establish a socket connection.
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'https://wassupchat.online', 
            credentials: true,
        },
    });

//    This middleware runs before a socket connection is accepted.
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
            
            // setting as strign ,Now every socket connection knows which 
            // user it belongs to.Socket connection: socket.id = abc123 socket.userId = user456
//allows the server to identify the user later.
            socket.userId = decoded.id.toString(); 
            
            next();
        } catch (error) {

        //   console.log("SOCKET AUTH ERROR:", error);

          return next(error);
}
    });


//io = the Socket.IO server (manages all connected clients)
// socket = one specific client connection
//Tell me whenever any new client connects to my Socket.IO server
    io.on("connection", (socket) => {
        const userId = socket.userId; 

        userSocketMap.set(userId, socket.id);
        console.log("SOCKET CONNECTED USER:", socket.userId );
        

        //sends the list of online users to all connected clients.
         io.emit('getOnlineUsers', Array.from(userSocketMap.keys()) )

//Which exact user disconnected?" for this particular connected client,
//  run this code when it disconnects."

        socket.on("disconnect", () => {

            userSocketMap.delete(userId);

            io.emit('getOnlineUsers', Array.from(userSocketMap.keys()) )

            console.log(`Disconnected: User [${userId}] removed`);

        
        });
    });

    return io;
};

