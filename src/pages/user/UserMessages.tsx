import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Search, 
  Send, 
  MoreVertical,
  Star,
  Archive,
  Clock,
  Shield,
  Headphones
} from "lucide-react";

const UserMessages = () => {
  const [selectedChat, setSelectedChat] = useState("admin-1");
  const [message, setMessage] = useState("");

  // Users can only chat with Admin (Customer Care)
  const conversations = [
    {
      id: "admin-1",
      type: "admin",
      name: "Customer Care - VistaMart",
      lastMessage: "Your order has been shipped successfully",
      time: "5 min ago",
      unread: 2,
      status: "important",
      avatar: "/placeholder.svg"
    },
    {
      id: "admin-2",
      type: "admin",
      name: "Support Team",
      lastMessage: "We've processed your refund request",
      time: "1 hour ago",
      unread: 0,
      status: "info",
      avatar: "/placeholder.svg"
    },
    {
      id: "admin-3",
      type: "admin",
      name: "Order Support",
      lastMessage: "How can we help you today?",
      time: "2 days ago",
      unread: 0,
      status: "normal",
      avatar: "/placeholder.svg"
    }
  ];

  const messages = [
    {
      id: "1",
      sender: "Customer Care",
      content: "Hello! I'm here to help you with your recent order. I see that you had a question about the delivery status.",
      time: "10:25 AM",
      isUser: false
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, I ordered a laptop 3 days ago and haven't received any tracking information yet.",
      time: "10:27 AM",
      isUser: true
    },
    {
      id: "3",
      sender: "Customer Care",
      content: "I apologize for the delay in communication. Let me check your order status right away. Can you please provide your order number?",
      time: "10:28 AM",
      isUser: false
    },
    {
      id: "4",
      sender: "You",
      content: "Sure! My order number is #VM-2024-1234",
      time: "10:29 AM",
      isUser: true
    },
    {
      id: "5",
      sender: "Customer Care",
      content: "Thank you! I've checked your order and I'm pleased to inform you that it was shipped this morning. Your tracking number is TRK123456789. You should receive it within 2-3 business days.",
      time: "10:31 AM",
      isUser: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent": return "bg-red-500";
      case "important": return "bg-secondary";
      case "info": return "bg-blue-500";
      case "normal": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Contact customer care for support</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button>
            <Star className="h-4 w-4 mr-2" />
            Important
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Conversations List */}
        <Card className="w-80 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Customer Support</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === conversation.id 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        <Headphones className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {conversation.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`} />
                          {conversation.unread > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <Headphones className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">Customer Care - VistaMart</h3>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Customer Support</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-muted-foreground">Available</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserMessages;
