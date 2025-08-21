/* eslint-disable no-console */
// eslint-disable-next-line unused-imports/no-unused-vars
import assets from "@/json/assest";
import { SearchWrap } from "@/styles/StyledComponents/SearchWrapper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button, Tooltip } from "@mui/material";
import RightChatPanel from "../RightChatPanel/RightChatPanel";
import SearchBottom from "../SearchBottom/SearchBottom";
import { GetChatResult } from "@/api/functions/search.api";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import CopyIcon from "@/ui/Icons/CopyIcon";
import PenIcon from "@/ui/Icons/PenIcon";

type ChatForm = {
  message: string;
};

type ChatMessage = {
  type: "bot" | "user";
  text: string;
  isTyping?: boolean;
};

export default function Search({ onValueSend }: any) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      text: "Hello, it's a pleasure to meet you. I'm Felp, your AI companion."
    }
  ]);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
    null
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [responseData, setResponseData] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 1500); // reset after 1.5s
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (text: string, index: number) => {
    setValue("message", text); // Set input field with previous message
    resetTranscript();
    setEditIndex(index); // Save the index to overwrite later
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<ChatForm>({
    defaultValues: { message: "" }
  });

  const { mutate: fetchChatResult } = useMutation({
    mutationFn: ({ search, domain }: { search: string; domain: string }) =>
      GetChatResult(search, domain)
  });
  // whenever transcript updates, put it into the input
  useEffect(() => {
    setValue("message", transcript);
  }, [transcript, setValue]);

  // auto‐scroll on every message change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const onSubmit = (data: ChatForm) => {
    const trimmedMsg = data.message.trim();
    if (!trimmedMsg) return;

    const domainFromStorage = localStorage.getItem("category") || "felp";

    // If editing: remove user+bot pair at that index
    if (editIndex !== null) {
      setChatMessages((prev) => {
        const updated = [...prev];
        updated.splice(editIndex, 2); // Remove user + bot
        return [
          ...updated.slice(0, editIndex),
          { type: "user", text: trimmedMsg },
          { type: "bot", text: "", isTyping: true },
          ...updated.slice(editIndex)
        ];
      });
    } else {
      // Normal new message
      setChatMessages((prev) => [
        ...prev,
        { type: "user", text: trimmedMsg },
        { type: "bot", text: "", isTyping: true }
      ]);
    }

    setIsTyping(true);

    fetchChatResult(
      { search: trimmedMsg, domain: domainFromStorage },
      {
        onSuccess: (data) => {
          const fullText =
            data?.botresponse?.response?.content || "No response.";
          setChatMessages((prev) => {
            const withoutTyping = [...prev];
            const lastIndex = withoutTyping.findIndex((m) => m.isTyping);
            if (lastIndex !== -1) withoutTyping.splice(lastIndex, 1);
            return [...withoutTyping, { type: "bot", text: "" }];
          });

          let i = 0;
          const interval = setInterval(() => {
            setChatMessages((prev) => {
              const base = prev.slice(0, -1);
              const nextSlice = fullText.slice(0, i + 1);
              return [...base, { type: "bot", text: nextSlice }];
            });
            i++;
            if (i >= fullText.length) {
              clearInterval(interval);
              if (data.botresponse?.response?.items?.length > 0) {
                setIsCollapsed(true);
                onValueSend?.(true);
                setResponseData(data.botresponse?.response?.items);
              } else {
                onValueSend?.(false);
              }
              setIsTyping(false);
            }
          }, 25);
        },
        onError: () => {
          setTimeout(() => {
            setChatMessages((prev) => {
              const withoutTyping = [...prev];
              const lastIndex = withoutTyping.findIndex((m) => m.isTyping);
              if (lastIndex !== -1) withoutTyping.splice(lastIndex, 1);
              return [
                ...withoutTyping,
                { type: "bot", text: "Something went wrong. Try again!" }
              ];
            });
            setIsTyping(false);
          }, 1500);
        }
      }
    );

    // Reset form
    setValue("message", "");
    setEditIndex(null); // Exit edit mode
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        type: "bot",
        text: "Hello, it's a pleasure to meet you. I'm Felp, your AI companion."
      }
    ]);
    setResponseData([]);
    setIsCollapsed(false);
    setIsTyping(false);
    onValueSend?.(false);
    resetTranscript();
    localStorage.removeItem("category");
  };

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US"
      });
    }
  };

  return (
    <SearchWrap>
      <Container className="full-container">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="outer-container">
              <div
                className={`list-container ${isCollapsed ? "collapsed" : ""}`}
              >
                <div className="left">
                  <div className="chat-header">
                    <Tooltip title="Start a new chat" arrow placement="left">
                      <Button
                        onClick={handleResetChat}
                        sx={{
                          minWidth: 0,
                          p: 1,
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent !important"
                          }
                        }}
                      >
                        <Image
                          src={assets.newChat}
                          width={30}
                          height={30}
                          alt="New Chat"
                        />
                      </Button>
                    </Tooltip>
                  </div>

                  <div className="chat-content">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={
                          msg.type === "bot" ? "bot-chat" : "user-chat"
                        }
                      >
                        {msg.type === "bot" && (
                          <>
                            <span className="icon">
                              <Image
                                src={assets.felpicon}
                                width={14}
                                height={23}
                                alt="bot"
                              />
                            </span>
                            <span className="bot-name">
                              <Image
                                src={assets.roboticon}
                                width={40}
                                height={40}
                                alt="bot"
                              />
                            </span>
                            <span className={`${msg.type}-txt`}>
                              {msg.isTyping ? (
                                <span className="typing-dots">
                                  Thinking <span></span>
                                  <span></span>
                                  <span></span>
                                </span>
                              ) : (
                                msg.text
                              )}
                            </span>
                          </>
                        )}

                        {msg.type === "user" && (
                          <>
                            <span className="user-name">
                              <Image
                                src={assets.usericon}
                                width={40}
                                height={40}
                                alt="user"
                              />
                            </span>
                            <p
                              className={` user-message`}
                              onMouseEnter={() => setHoveredMessage(idx)}
                              onMouseLeave={() => setHoveredMessage(null)}
                              style={{ position: "relative" }}
                            >
                              <span className={`${msg.type}-txt`}>
                                {msg.text}
                              </span>

                              {hoveredMessage === idx && (
                                <span className="message-actions">
                                  <Tooltip title={copiedMessageIndex === idx ? "Copied" : "Copy"} arrow>
                                    <button
                                      onClick={() => handleCopy(msg.text, idx)}
                                    >
                                      {copiedMessageIndex === idx ? (
                                        "✅"
                                      ) : (
                                        <CopyIcon />
                                      )}
                                    </button>
                                  </Tooltip>

                                  <Tooltip title="Edit" arrow>
                                    <button
                                      onClick={() => handleEdit(msg.text, idx)}
                                    >
                                      <PenIcon />
                                    </button>
                                  </Tooltip>
                                </span>
                              )}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="search-wrapper"
                  >
                    <div className="input-box">
                      <input
                        type="text"
                        placeholder="Type your message or use mic..."
                        {...register("message")}
                        onKeyDown={(e) => {
                          if (isTyping && e.key === "Enter") {
                            e.preventDefault();
                            return;
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </div>

                    <div className="function-btn">
                      <Button
                        onClick={toggleListening}
                        sx={{ minWidth: 0, p: 0, mr: 1 }}
                      >
                        <Image
                          src={listening ? assets.mic : assets.mic}
                          width={59}
                          height={59}
                          alt={listening ? "Stop Mic" : "Start Mic"}
                        />
                      </Button>
                      <Button
                        type="submit"
                        disabled={isTyping || isSubmitting}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent !important"
                          }
                        }}
                      >
                        <Image
                          src={
                            isTyping || isSubmitting
                              ? assets.arrow2
                              : assets.arrow
                          }
                          width={59}
                          height={59}
                          alt="arrow"
                        />
                      </Button>
                    </div>
                  </form>
                </div>

                <RightChatPanel sliderData={responseData} />
              </div>

              <SearchBottom isCollapsed={isCollapsed} />
            </div>
          </Grid>
        </Grid>
      </Container>

      <div className="bg-video">
        <video width="100%" height="360" autoPlay muted loop>
          <source src="/assets/images/video2.mp4" type="video/mp4" />
        </video>
      </div>
    </SearchWrap>
  );
}
