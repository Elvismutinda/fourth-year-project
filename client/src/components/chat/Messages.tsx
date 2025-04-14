import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { memo } from "react";
import { ThinkingMessage } from "./ThinkingMessage";
import type { UseChatHelpers } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { PreviewMessage } from "./PrevewMessage";
import equal from "fast-deep-equal";
interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
}

function PureMessages({ messages, status }: MessagesProps) {
  const [messageContainerRef, messageEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messageContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div ref={messageEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
