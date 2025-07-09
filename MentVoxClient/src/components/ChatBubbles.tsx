import "./ChatBubbles.css";

type ChatMessage = {
  from: "user" | "bot";
  text: string;
};

type Props = {
  messages: ChatMessage[];
};

const ChatBubbles: React.FC<Props> = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.from === "user" ? "user" : "bot"}`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatBubbles;
