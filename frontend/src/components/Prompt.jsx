import { ArrowUp, Bot, Globe, Paperclip } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../public/logo.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

const Prompt = () => {
  const [inputvalue, setinputvalue] = useState("");
  const [typemessage, settypemessage] = useState("");

  const [prompt, setprompt] = useState([]);
  const [loading, setloading] = useState(false);
  const promptEndref = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storeprompt = localStorage.getItem(`promptHistory_${user._id}`);
    if (storeprompt) {
      setprompt(JSON.parse(storeprompt));
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`romptHistory_${user._id}`, JSON.stringify(prompt));
  }, [prompt]);
  useEffect(() => {
    promptEndref.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompt, loading]);
  console.log(prompt);

  const handlesend = async () => {
    const trimed = inputvalue.trim();
    if (!trimed) return;
    settypemessage(trimed);
    setinputvalue("");
    setloading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/deepseekai/prompt",
        { content: trimed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setprompt((prev) => [
        ...prev,
        {
          role: "user",
          content: trimed,
        },
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setprompt((prev) => [
        ...prev,
        {
          role: "user",
          content: trimed,
        },
        {
          role: "assistant",
          content: "something went wrong ai response",
        },
      ]);
    } finally {
      setloading(false);
      settypemessage(null);
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      handlesend();
    }
  };
  return (
    <div className="flex flex-col  items-center justify-center flex-1 w-full px-4 pb-4">
      {/* Greeting Section */}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2">
          <img
            src={logo} // Replace with Deepseek logo
            alt="deepseek logo"
            className="h-8"
          />
          <h1 className="text-3xl font-semibold text-white mb-2">
            Hi, I'm Deepseek
          </h1>
        </div>
        <p className="text-gray-400 text-base mt-2">
          How can I help you today?
        </p>
      </div>

      {/* Prompt History Section */}
      <div className="w-full  max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1">
        {/* <div> */}
        {prompt.map((prompt, index) => (
          <div
            className={`w-full flex ${
              prompt.role === "user" ? "justify-end" : "justify-start"
            }`}
            key={index}
          >
            {prompt.role === "assistant" ? (
              <div className="w-full bg-black text-white rounded-xl px-4 py-3 text-sm whitespace-pre-line">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {prompt.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-[50%] bg-blue-700 mb-2 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap">
                {prompt.content}
              </div>
            )}
          </div>
        ))}
        {loading && typemessage && (
          <div className="w-[30%] justify-end self-end ml-auto break-words bg-blue-700 mb-2 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap">
            {typemessage}
          </div>
        )}

        {loading && (
          <div className="flex justify-start w-full">
            {""}
            <div className="bg-black text-white px-4 py-2 rounded-xl text-sm  animate-pulse">
              Loading....
            </div>
          </div>
        )}
        <div ref={promptEndref} />
      </div>

      {/* Input Box */}
      <div className="w-full max-w-4xl relative mx-auto px-2">
        <div className="bg-[#2f2f2f] rounded-[2rem] px-6 py-8 shadow-md">
          <input
            value={inputvalue}
            onChange={(e) => setinputvalue(e.target.value)}
            onKeyDown={handlekeydown}
            type="text"
            placeholder="Message Deepseek"
            className="bg-transparent w-full text-white placeholder-gray-400 text-lg outline-none"
          />
          <div className="flex items-center justify-between mt-4 gap-4">
            {/* Left Buttons */}
            <div className="flex gap-2">
              <button className="rounded-full text-base px-3 py-1.5 text-white transition flex items-center gap-2 border border-gray-500 hover:bg-gray-500">
                <Bot className="w-4 h-4" /> DeepThink (R1)
              </button>
              <button className="rounded-full text-base px-3 py-1.5 text-white transition flex items-center gap-2 border border-gray-500 hover:bg-gray-500">
                <Globe className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handlesend}
                className="bg-gray-500 hover:bg-blue-950 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
