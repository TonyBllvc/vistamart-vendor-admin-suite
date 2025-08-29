import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  AlertCircle
} from "lucide-react";

const AdminMessages = () => {
  const [selectedChat, setSelectedChat] = useState("vendor-1");
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: "vendor-1",
      type: "vendor",
      name: "TechStore Pro",
      lastMessage: "I need help with my product listing approval",
      time: "2 min ago",
      unread: 3,
      status: "high",
      avatar: "/placeholder.svg"
    },
    {
      id: "vendor-2",
      type: "vendor",
      name: "Fashion Hub",
      lastMessage: "Can you help me with the commission rates?",
      time: "15 min ago",
      unread: 1,
      status: "medium",
      avatar: "/placeholder.svg"
    },
    {
      id: "customer-1",
      type: "customer",
      name: "Sarah Johnson",
      lastMessage: "I have an issue with my recent order",
      time: "1 hour ago",
      unread: 0,
      status: "low",
      avatar: "/placeholder.svg"
    },
    {
      id: "vendor-3",
      type: "vendor",
      name: "Electronics World",
      lastMessage: "Thank you for resolving the issue!",
      time: "2 hours ago",
      unread: 0,
      status: "resolved",
      avatar: "/placeholder.svg"
    },
    {
      id: "customer-2",
      type: "customer",
      name: "Mike Chen",
      lastMessage: "When will my refund be processed?",
      time: "3 hours ago",
      unread: 2,
      status: "medium",
      avatar: "/placeholder.svg"
    }
  ];

  const messages = [
    {
      id: "1",
      sender: "TechStore Pro",
      content: "Hello admin, I need help with my product listing approval. My latest iPhone listing has been pending for 3 days now.",
      time: "10:30 AM",
      isAdmin: false
    },
    {
      id: "2",
      sender: "Admin",
      content: "Hi there! I understand your concern. Let me check the status of your iPhone listing. Can you provide me with the product ID?",
      time: "10:32 AM",
      isAdmin: true
    },
    {
      id: "3",
      sender: "TechStore Pro",
      content: "Sure! The product ID is TECH-IPH15-001. It's the iPhone 15 Pro Max listing I submitted on Monday.",
      time: "10:33 AM",
      isAdmin: false
    },
    {
      id: "4",
      sender: "Admin",
      content: "I found the listing. The delay was due to some missing technical specifications in the product description. I've approved it now and it should be live within the next hour. Please ensure all required fields are filled for future listings.",
      time: "10:35 AM",
      isAdmin: true
    },
    {
      id: "5",
      sender: "TechStore Pro",
      content: "That's great! Thank you so much for the quick resolution. I'll make sure to double-check all specifications for future listings.",
      time: "10:37 AM",
      isAdmin: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "vendor" ? <Users className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with vendors and customers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button>
            <Star className="h-4 w-4 mr-2" />
            Priority
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Conversations List */}
        <Card className="w-80 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Conversations</CardTitle>
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
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(conversation.type)}
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
                      <AvatarFallback>TP</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">TechStore Pro</h3>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Vendor</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-xs text-muted-foreground">High Priority</span>
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
                    <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isAdmin 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
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

export default AdminMessages;