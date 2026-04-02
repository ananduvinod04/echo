// MessagePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal } from 'lucide-react';

const socket = io('http://localhost:4000');

export default function MessagePage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    socket.emit('send_message', messageData);
    setChatHistory((prev) => [...prev, messageData]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-3 sm:p-6">
      <Card className="w-full max-w-2xl h-[90vh] rounded-3xl shadow-xl border bg-background">
        <CardHeader className="border-b px-4 sm:px-6 py-4">
          <CardTitle className="text-lg sm:text-2xl font-bold">
            Live Chat
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(90vh-80px)] p-0">
          <ScrollArea className="flex-1 px-3 sm:px-5 py-4">
            <div className="space-y-3">
              {chatHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-10">
                  No messages yet. Start the conversation 👋
                </p>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className="ml-auto max-w-[85%] sm:max-w-[70%] rounded-2xl bg-primary text-primary-foreground px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className="text-[10px] sm:text-xs mt-1 opacity-80 text-right">
                      {msg.time}
                    </p>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="h-11 rounded-2xl text-sm sm:text-base"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                className="h-11 w-11 rounded-2xl shrink-0"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

