import { useEffect, useState } from "react";
import "./App.css";
import { Bounce, toast } from "react-toastify";
import { Copy, Plus, Send } from "lucide-react";

function App() {
  interface Messages {
    name: string;
    message: string;
  }

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [msg, setMsg] = useState<Messages[]>([]);
  const [currentMsg, setCmsg] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [roomid, setRoom] = useState<string>("");
  const [connect, setConnect] = useState(false);
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL;
    if (!wsUrl) {
      console.error("WebSocket URL is not defined");
      return;
    }
    console.log("don");
    const ws = new WebSocket(wsUrl);

    setWs(ws);
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMsg((prev) => [...prev, data]);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  function sendMsg() {
    if (currentMsg.trim() === "") return;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not open yet.");
      toast.error("Connection not ready. Please wait...");
      return;
    }
    ws.send(
      JSON.stringify({
        type: "chat",
        payload: {
          name: username,
          message: currentMsg,
        },
      })
    );
    setCmsg("");
  }

  function createRoom() {
    if (username == "") {
      toast.error("Please enter your name", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    const chars = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];
    let id = "";
    for (let i = 0; i < 5; i++) {
      const randomidx = Math.floor(Math.random() * chars.length);
      id += chars[randomidx];
    }
    joinRoom(id);
  }
  function joinRoom(roomidd: string | undefined = undefined) {
    if (roomidd == "") {
      toast.error("Please enter a room id", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (username == "") {
      toast.error("Please your name ", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (!ws) {
      return;
    }
    const message = {
      type: "join",
      payload: {
        roomid: roomidd ? roomidd : roomid,
      },
    };
    setConnect(true);
    localStorage.setItem("roomid", roomidd ? roomidd : roomid);
    localStorage.setItem("name", username);
    ws?.send(JSON.stringify(message));

    toast.success("🦄 Wow so easy!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && currentMsg.trim() !== "") {
      sendMsg();
    }
  }

  return (
    <>
      {!connect ? (
        <div className="h-screen bg-black/90 flex justify-center">
          <div className="flex flex-col items-center mt-[10vh]">
            <div className="text-white text-5xl font-bold">
              <h1>
                Chat<span className="bg-green-500">Idfy</span>
              </h1>
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <label className="text-white ml-2 font-semibold">Name</label>
              <input
                className="text-white px-2 bg-placeholder-white rounded-xl w-[60vh] md:w-[100vh] h-[8vh] border border-white/50"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <label className="text-white ml-2 font-semibold">RoomID</label>
              <div className="flex gap-2">
                <input
                  className="text-white px-2 bg-placeholder-white rounded-xl w-[50vh] md:w-[90vh] h-[8vh] border border-white/50"
                  placeholder="Enter Room ID"
                  value={roomid}
                  onChange={(e) => setRoom(e.target.value)}
                />
                <div>
                  <button
                    className="text-white border border-white/50 rounded-xl h-[8vh] w-[10vh] flex items-center gap-2 justify-center hover:bg-green-500"
                    onClick={() => joinRoom(roomid)}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center my-4 w-full">
              <div className="flex-1 border-t border-[#4e4e4e]"></div>
              <span className="px-4 text-[#4e4e4e]">or</span>
              <div className="flex-1 border-t border-[#4e4e4e]"></div>
            </div>
            <div>
              <button
                className="text-white border border-white/50 rounded-xl h-[10vh] w-[60vh] md:w-[100vh] flex items-center gap-2 justify-center hover:bg-green-500"
                onClick={createRoom}
              >
                <Plus />
                Create Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen bg-black">
          <div className="flex justify-center items-center pt-10 flex-col gap-4 h-4/5">
            <div className=" text-white bg-[#161616] md:w-[150vh] w-[80vh] h-[10vh] rounded-md border border-white/40 flex justify-between px-4">
              <div className="flex items-center font-semibold">
                <h1>RoomID: {localStorage.getItem("roomid")}</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const id = localStorage.getItem("roomid");
                    if (!id) return;
                    navigator.clipboard.writeText(id);
                    toast.success("Copied to clipboard");
                  }}
                  className="hover:bg-white/10 p-2 rounded-md transition-colors"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
            <div className="h-full w-[80vh] md:w-[150vh] bg-[#161616] rounded-md">
              {msg.map((e, i) => {
                const isUserMessage = localStorage.getItem("name") === e.name;
                return (
                  <div
                    key={i}
                    className={`mb-4 flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[70%] mx-4">
                      <div className="text-xs text-gray-400 mb-1 px-1">
                        {e.name}
                      </div>
                      <div
                        className={`p-3 rounded-lg text-white ${
                          isUserMessage
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {e.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-1/6 border-t border-white/50 mt-4 flex justify-center pt-4">
            <div className=" h-[10vh] md:w-[150vh] w-[80vh] bg-[#161616] rounded-md flex gap-2">
              <div className="w-full h-full text-white font-semibold font-xl p-2">
                {" "}
                <input
                  className="w-full h-full text-white font-semibold font-xl p-2"
                  placeholder="Type your message..."
                  value={currentMsg}
                  onChange={(e) => setCmsg(e.target.value)}
                  onKeyDown={handleKeyPress}
                ></input>
              </div>
              <div className="flex items-center p-2">
                {" "}
                <button
                  className="bg-green-500 text-white p-4 rounded-xl"
                  onClick={sendMsg}
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
