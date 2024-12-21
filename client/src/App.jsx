import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import random from "random";

const socket = io("http://localhost:8000");

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [room, setRoom] = useState("");
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        setAuthor(random.float());
        socket.on("recieve-message", (msg) => {
            console.log(msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off("recieve-message");
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input) {
            const message = {
                message: input,
                author: author,
            };
            setMessages((prev) => [...prev, message]);
            socket.emit("chat message", message, room);
            setInput("");
        }
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (room) {
            socket.emit("join-room", room);
        }
    };

    return (
        <div className=" w-screen flex flex-col justify-between h-screen p-5 ">
            <ul className={` border list-image-none  h-full   bg-yellow-50 overflow-y-auto  p-5 `}>
                {messages.map((msg, index) => (
                    <div
                        className={` m-2   rounded-md py-1 ${msg.author === author ? " justify-end" : ""}  flex  px-2 `}
                        key={index}
                    >
                        <p
                            className={`w-fit py-2 px-3 rounded-md ${
                                msg.author === author ? " bg-green-500" : "bg-blue-500"
                            }   `}
                        >
                            {msg.message}
                        </p>
                    </div>
                ))}

                {/* {messages.map((msg, i) => {
                    return <li key={i}>{msg.message}</li>;
                })} */}
            </ul>
            <form className=" mt-2 w-full  flex" onSubmit={sendMessage}>
                <input
                    className=" border border-blue-500 w-full outline-none h-10 pl-2 text-xs md:text-lg"
                    placeholder="Enter your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className=" border border-green-500 ml-2 text-xs md:text-lg w-20 py-1 px-4 h-10 font-bold ">
                    Send
                </button>
            </form>
            <form className=" mt-2 w-full  flex" onSubmit={joinRoom}>
                <input
                    className=" border border-blue-500 w-full outline-none h-10 pl-2  text-xs md:text-lg"
                    placeholder="Enter the room number"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button
                    className=" border border-fuchsia-500 ml-2 text-xs md:text-lg  py-1 w-20 px-4 h-10 font-bold "
                    type="submit"
                >
                    Join
                </button>
            </form>
        </div>
    );
}

export default App;
