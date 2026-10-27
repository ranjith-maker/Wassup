Wassup
A real-time one-to-one chat app, like a small WhatsApp. 
Sign in with an email OTP (no passwords), see the other users, and chat with text and images with live online status.

Live: https://wassupchat.online

Features
Passwordless login. A 6-digit OTP is emailed to the user. The same flow handles both sign-up and sign-in.
Real-time messaging with Socket.IO: messages appear instantly for the receiver.
Image sharing (up to 5 MB), stored on Cloudinary.
Online / offline status for every user.
Live profile updates. Changing your picture or bio updates for everyone without a refresh.
Persistent history. Messages are saved to MongoDB, so offline users see everything when they return.
Route-level code splitting (React.lazy) and shimmer loading states.

Tech stack
Tier	Technology
Frontend	React 19, Redux Toolkit, React Router 7, Tailwind CSS 4, Vite, Socket.IO client, Axios, emoji-picker-react
Backend	Node.js, Express 5, Socket.IO, Mongoose 9, JWT, Multer, cookie-parser, Morgan, validator
Database	MongoDB (Atlas)
Services	Cloudinary (image storage), Resend (OTP email over HTTPS)
Architecture
Wassup is a three-tier application with a monolithic backend: the frontend and API are deployed separately, and one Express + Socket.IO server handles auth, users, chat and real-time events. Only the API talks to the database.

Node.js server
REST + cookie
WebSocket
React appRedux Toolkit
Express API
Socket.IOsame server
MongoDB
Cloudinary
Resend for Email
How a message travels
The database is the source of truth. A message is saved first, then pushed.

Receiver (browser)
MongoDB
Express API
Sender (browser)
Receiver (browser)
MongoDB
Express API
Sender (browser)
POST /api/chat/send-message (cookie + multipart)
verify JWT, parse image (multer)
save message
Socket.IO "newMessage" (only if receiver is online)
201 + saved message
If the receiver is offline, nothing is lost: they load the history from MongoDB when they open the chat.

Key design decisions
HTTP for sending, WebSocket for notifying. Uploads fit multipart HTTP naturally, and the sender gets a clear success or failure response. The socket's only job is to tell the receiver something new arrived.
JWT in an httpOnly cookie, not localStorage, so page scripts can't read the token. The same cookie authenticates the Socket.IO handshake, so HTTP and real time share one identity.
Conversation key (roomId). The two user IDs are sorted and joined, so A→B and B→A always map to the same conversation. This is a database key, not a Socket.IO room.
OTP with a TTL index. OTP documents expire after 5 minutes and are deleted after successful use.
Resend over HTTPS instead of SMTP, because many cloud platforms block outbound SMTP ports. A verified domain is required to send to arbitrary recipients.

Project structure
client/
  src/
    components/     MessageTab, SideBar, SenderMessage, ReceiverMessage, ShimmerLoading
    context/        SocketContext (socket lifecycle + event listeners)
    customHooks/    useAuthSynchronization (restore session on refresh)
    pages/          Auth (SendOtp, VerifyOtp), Home, Profile, ProfileDetails
    store/          Redux Toolkit: appStore, userSlice, chatSlice
server/
  index.js          Express + Socket.IO bootstrap
  config/           DB.js, Cloudinary.js
  controllers/      authController, chatController, userController
  middlewares/      authUser (JWT), multer (memory storage, 5 MB limit)
  models/           User, Message, OTP
  routes/           authRoutes, chatRoutes, userRoutes
  services/         Socket.js, EmailServices.js
  utils/            AppError, catchAsync, errorHandler, Cloudinary upload helper
API reference
Base path: /api. Authentication is via the token cookie.


Author
Built by Ranjith, a self-taught full-stack developer.




