import { io } from "socket.io-client";



const socket = io(process.env.REACT_APP_BASE_URL_FOR_SOCKET ||
    "http://localhost:5000",
    { autoConnect: false });

export default socket;
