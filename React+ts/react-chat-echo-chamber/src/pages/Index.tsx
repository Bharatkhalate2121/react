import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Room {
  roomId: string;
}

interface Message {
  id?: number;
  content: string;
  sender: string;
  timestamp: string;
  room: Room;
}

const Index = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connect = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to connect",
        variant: "destructive",
      });
      return;
    }

    console.log('Attempting to connect to WebSocket...');
    const socket = new SockJS('http://localhost:9090/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Successfully connected to WebSocket:', frame);
      setConnected(true);
      setIsUsernameSet(true);

      // Subscribe to the current room - this matches your Spring Boot /topic/{roomId} pattern
      const subscription = client.subscribe(`/topic/1`, (message) => {
        console.log('Raw message received:', message.body);
        try {
          const receivedMessage = JSON.parse(message.body);
          console.log('Parsed message:', receivedMessage.data);
          setMessages(prev => [...prev, receivedMessage?.data]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      console.log('Subscribed to topic:', `/topic/1`);

      toast({
        title: "Connected",
        description: `Successfully connected to chat room: 1`,
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error - Headers:', frame.headers);
      console.error('STOMP Error - Body:', frame.body);
      setConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the chat server. Make sure the backend is running on localhost:8080",
        variant: "destructive",
      });
    };

    client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      toast({
        title: "Disconnected",
        description: "Connection to chat server lost",
        variant: "destructive",
      });
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket connection error:', error);
      toast({
        title: "WebSocket Error",
        description: "Failed to establish WebSocket connection",
        variant: "destructive",
      });
    };

    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('Error activating STOMP client:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to WebSocket server",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (stompClient) {
      console.log('Disconnecting from WebSocket...');
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
      setIsUsernameSet(false);
      setMessages([]);
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from chat",
      });
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !stompClient || !connected) {
      console.log('Cannot send message - conditions not met');
      return;
    }

    // Create message object that matches your Spring Boot Message entity structure
    const message: any = {
      "message": "i found this on crop",
      "fromUser": {
        "id": 3
      },
      "toUser": {
        "id": 2
      },
      "room": {

        "roomId": 1

      }
    }

    console.log('Sending message:', message);
    console.log('Destination:', '/app/chat.sendMessage');

    try {
      // Send to /app/chat.sendMessage which matches your @MessageMapping annotation
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message),
      });
      setMessageInput('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isUsernameSet) {
        sendMessage();
      } else {
        connect();
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      // Handle both ISO string and LocalDateTime formats
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid time';
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Join Chat Room
            </CardTitle>
            <p className="text-gray-600">Enter your username to start chatting</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Room ID (default: general)"
                value={currentRoom}
                onChange={(e) => setCurrentRoom(e.target.value || 'general')}
                className="text-center"
              />
            </div>
            <Button
              onClick={connect}
              className="w-full"
              disabled={!username.trim()}
            >
              <Users className="mr-2 h-4 w-4" />
              Connect to Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold">
                Chat Room: {currentRoom}
              </CardTitle>
              <p className="text-sm text-gray-600">Logged in as: {username}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-1">
                {connected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    Disconnected
                  </>
                )}
              </Badge>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex ${message.message === message ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${message.sender === username
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium opacity-75">
                            {message.message}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!connected}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!connected || !messageInput.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
