import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Crown, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  messages: Message[];
  messageCount: number;
  isPremium: boolean;
  messagesRemaining: number | null;
  resetAt: string | null;
}

export default function Chat() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { data: session, isLoading } = useQuery<ChatSession>({
    queryKey: ['/api/chat/session'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest('POST', '/api/chat/message', { message: messageText });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/session'] });
      setMessage('');
      setTimeout(scrollToBottom, 100);
    },
    onError: (error: any) => {
      if (error.limitExceeded) {
        const hours = Math.floor(error.remainingMinutes / 60);
        const minutes = error.remainingMinutes % 60;
        const timeText = hours > 0 
          ? `${hours}h ${minutes}min` 
          : `${minutes} minutes`;
        
        toast({
          title: "Limite atteinte",
          description: `Tu as utilisé tes 5 messages gratuits. Reviens dans ${timeText} ou passe au plan Premium pour continuer !`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message. Réessaye.",
          variant: "destructive",
        });
      }
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/chat/session');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/session'] });
      toast({
        title: "Conversation effacée",
        description: "L'historique de conversation a été supprimé.",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-chat" />
      </div>
    );
  }

  const messages = session?.messages || [];
  const isPremium = session?.isPremium || false;
  const messagesRemaining = session?.messagesRemaining ?? 5;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-chat-title">
            Aide IA
          </h1>
          <p className="text-muted-foreground" data-testid="text-chat-description">
            Pose tes questions et obtiens de l'aide pour mieux comprendre tes cours
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPremium ? (
            <Badge variant="default" className="gap-1" data-testid="badge-premium">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1" data-testid="badge-free">
              Gratuit ({messagesRemaining}/5)
            </Badge>
          )}
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              data-testid="button-clear-chat"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      <Card className="flex flex-col h-[calc(100vh-250px)]">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2" data-testid="card-title-chat">
            <Bot className="w-5 h-5" />
            Assistant Éducatif
          </CardTitle>
          <CardDescription data-testid="card-description-chat">
            {isPremium 
              ? "Tu as un accès illimité au chatbot !" 
              : `Il te reste ${messagesRemaining} message${messagesRemaining > 1 ? 's' : ''} pour cette session.`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Bot className="w-16 h-16 text-muted-foreground mb-4" data-testid="icon-chat-empty" />
                <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">
                  Commence une conversation
                </h3>
                <p className="text-muted-foreground max-w-md" data-testid="text-empty-description">
                  Pose une question sur tes cours ou demande des explications sur un concept difficile. 
                  L'assistant IA est là pour t'aider !
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${msg.role}-${index}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pose ta question ici..."
              className="resize-none"
              rows={2}
              disabled={sendMessageMutation.isPending}
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="self-end"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          {!isPremium && messagesRemaining <= 2 && messagesRemaining > 0 && (
            <p className="text-sm text-muted-foreground mt-2" data-testid="text-warning-limit">
              ⚠️ Attention : Il te reste seulement {messagesRemaining} message{messagesRemaining > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </Card>

      {!isPremium && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" data-testid="card-title-premium">
              <Crown className="w-5 h-5 text-primary" />
              Passe au Premium
            </CardTitle>
            <CardDescription data-testid="card-description-premium">
              Accès illimité au chatbot IA pour seulement 1 500 XAF/mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full" data-testid="button-upgrade-premium">
              <Crown className="w-4 h-4 mr-2" />
              Devenir Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
