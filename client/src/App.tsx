import './App.css';
import React, {useState, useEffect, useRef} from "react";
import config from "./config";
import io from 'socket.io-client';

let socket = io(`${config.wsUrl}`);

interface ConversationItem {
    userPrompt?: string;
    llmResponse?: string;
}

function App() {
    const [inputValue, setInputValue] = useState("");
    const [conversationList, setConversationList] = useState<ConversationItem[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket = io(`${config.wsUrl}`);
        socket.emit('message', "reset");

        socket.on('message', (data: string) => {
            console.log(data)
            if (data === "reset") {
                setConversationList([]);
                return;
            }
            const parsedData = JSON.parse(data);
            console.log(parsedData, typeof(parsedData))
            setConversationList(parsedData);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // everytime content change in input, reset the value.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // if user input Ctrl+Enter, send the message.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault(); // cancel the default
            sendMessage();
        }
    };

    // send message to backend, clear the input value and input element.
    const sendMessage = () => {
        if (inputValue.trim()) {
            setConversationList([...conversationList, {"userPrompt": inputValue}]);
            console.log(`message sent ${conversationList}, ${inputValue}`)
            socket.emit('message', [...conversationList, {"userPrompt": inputValue}]);
            setInputValue('');
            const inputElement = document.querySelector('input');
            if (inputElement) {
                inputElement.value = '';
            }
        } else {
            alert("empty message!");
            return;
        }
    };

    useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    }, [conversationList]);

    return (
        <div className="fullscreen">
            <div style={{paddingBottom: '100px'}}>
                {conversationList.length > 0 ? (
                    <div>
                        {conversationList.map((item, index) => {
                            // 遍历 conversationList 中的每个对象
                            return Object.entries(item).map(([key, value]) => (
                                <div key={index} className="dialog-container" style={{
                                    marginLeft: key === 'userPrompt' ? 'auto' : '0',
                                    marginRight: key === 'userPrompt' ? '0' : 'auto'
                                }}>
                                    <div className="dialog-content" style={{textAlign: key === 'llmResponse' ? 'left' : 'right'}}>
                                        {value as string}
                                    </div>
                                    <div ref={bottomRef} ></div>
                                </div>
                            ));
                        })}

                    </div>
                ) : (
                    <p>loading...</p> // show loading at start
                )}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="input your message here"
                />
                <button onClick={sendMessage}>send</button>
            </div>
        </div>
    );
}

export default App;
