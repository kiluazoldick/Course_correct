import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Crown, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { Link } from 'wouter';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    if (!message.trim() || sendMessageMutation.isPending) return;
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-chat-title">Tariq IA</h1>
            <p className="text-sm text-muted-foreground">Ton assistant personnel d'études</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isPremium && (
            <Badge variant="secondary" className="gap-1 text-xs" data-testid="badge-messages-remaining">
              {messagesRemaining} message{messagesRemaining > 1 ? 's' : ''} restant{messagesRemaining > 1 ? 's' : ''}
            </Badge>
          )}
          {isPremium && (
            <Badge variant="default" className="gap-1" data-testid="badge-premium">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              data-testid="button-clear-chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Salut ! Je suis Tariq</h2>
              <p className="text-muted-foreground max-w-md">
                Je suis là pour t'aider à réviser tes cours et réussir tes examens. 
                Pose-moi n'importe quelle question sur tes matières !
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mt-4">
              <button
                onClick={() => setMessage("Explique-moi le théorème de Pythagore")}
                className="p-4 border rounded-lg hover-elevate active-elevate-2 text-left text-sm"
              >
                <div className="font-medium">Explication de concept</div>
                <div className="text-muted-foreground text-xs mt-1">Explique-moi le théorème de Pythagore</div>
              </button>
              <button
                onClick={() => setMessage("Comment réviser efficacement pour un examen ?")}
                className="p-4 border rounded-lg hover-elevate active-elevate-2 text-left text-sm"
              >
                <div className="font-medium">Méthode de révision</div>
                <div className="text-muted-foreground text-xs mt-1">Comment réviser efficacement ?</div>
              </button>
              <button
                onClick={() => setMessage("Donne-moi des astuces pour mémoriser mes cours")}
                className="p-4 border rounded-lg hover-elevate active-elevate-2 text-left text-sm"
              >
                <div className="font-medium">Techniques de mémorisation</div>
                <div className="text-muted-foreground text-xs mt-1">Astuces pour mémoriser mes cours</div>
              </button>
              <button
                onClick={() => setMessage("Comment gérer mon stress avant les examens ?")}
                className="p-4 border rounded-lg hover-elevate active-elevate-2 text-left text-sm"
              >
                <div className="font-medium">Gestion du stress</div>
                <div className="text-muted-foreground text-xs mt-1">Gérer le stress des examens</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${msg.role === 'user' ? '' : ''}`}
              >
                <div className="flex-shrink-0">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">Tu</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 pt-1">
                  <div className="font-medium text-sm">
                    {msg.role === 'user' ? 'Toi' : 'Tariq'}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 pt-1">
                  <div className="font-medium text-sm">Tariq</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Réflexion en cours...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background">
        <div className="max-w-3xl mx-auto p-4">
          {!isPremium && messagesRemaining === 0 && session?.resetAt && (
            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Limite gratuite atteinte
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Tu pourras utiliser Tariq IA à nouveau dans {
                      (() => {
                        const resetDate = new Date(session.resetAt);
                        const now = new Date();
                        const diffMs = resetDate.getTime() - now.getTime();
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} minutes`;
                      })()
                    }
                  </p>
                </div>
                <Link href="/subscription">
                  <Button size="sm" data-testid="button-upgrade-from-limit">
                    <Crown className="w-3 h-3 mr-1" />
                    Passer au Premium
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Pose ta question à Tariq..."
                className="min-h-[52px] max-h-[200px] resize-none pr-12"
                disabled={sendMessageMutation.isPending || (!isPremium && messagesRemaining === 0)}
                data-testid="input-message"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending || (!isPremium && messagesRemaining === 0)}
              size="icon"
              className="h-[52px] w-[52px] flex-shrink-0"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Tariq peut faire des erreurs. Vérifie les informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
