import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Crown, Loader2, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
  const { t } = useLanguage();

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
    onSuccess: () => {
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
          title: t.chatPage.limitReached,
          description: t.chatPage.limitReachedDesc.replace('{time}', timeText),
          variant: "destructive",
        });
      } else {
        toast({
          title: t.chatPage.error,
          description: t.chatPage.cannotSend,
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
        title: t.chatPage.chatCleared,
        description: t.chatPage.chatClearedDesc,
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

  // Suggestion cards from translations
  const suggestionCards = [
    t.chatPage.suggestionCards.concept,
    t.chatPage.suggestionCards.study,
    t.chatPage.suggestionCards.memory,
    t.chatPage.suggestionCards.stress,
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md border-2 border-primary/20 flex items-center justify-center bg-primary/5">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm md:text-base" data-testid="text-chat-title">{t.chatPage.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {!isPremium && (
            <Badge variant="secondary" className="hidden md:flex gap-1 text-xs" data-testid="badge-messages-remaining">
              {messagesRemaining} {t.chatPage.messagesLeft}
            </Badge>
          )}
          {isPremium && (
            <Badge variant="default" className="gap-1" data-testid="badge-premium">
              <Crown className="w-3 h-3" />
              <span className="hidden md:inline">{t.chatPage.premiumBadge}</span>
            </Badge>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              data-testid="button-clear-chat"
              className="h-8 w-8 p-0 md:w-auto md:px-3"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline ml-2">{t.chatPage.clearChat}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center py-8 md:py-12">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 border-primary/20 flex items-center justify-center bg-primary/5 mb-4 md:mb-6">
                <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold mb-2">
                {t.chatPage.greeting}
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md mb-6 md:mb-8">
                {t.chatPage.subtitle}
              </p>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl">
                {suggestionCards.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(suggestion.message)}
                    className="p-2.5 md:p-3 border rounded-lg hover-elevate active-elevate-2 text-left transition-all"
                    data-testid={`suggestion-${idx}`}
                  >
                    <div className="font-medium text-xs md:text-sm">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{suggestion.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 md:py-8 space-y-6 md:space-y-8">
              {messages.map((msg, index) => (
                <div key={index} className="group">
                  <div className="flex gap-3 md:gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 pt-1">
                      {msg.role === 'user' ? (
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center">
                          <span className="text-xs md:text-sm font-medium text-primary">
                            {t.chatPage.avatarYou}
                          </span>
                        </div>
                      ) : (
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-md border-2 border-primary/20 flex items-center justify-center bg-primary/5">
                          <GraduationCap className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="font-semibold text-xs md:text-sm text-foreground/90">
                        {msg.role === 'user' ? t.chatPage.avatarLabel : 'Tariq'}
                      </div>
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading State */}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-md border-2 border-primary/20 flex items-center justify-center bg-primary/5">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-semibold text-xs md:text-sm text-foreground/90">Tariq</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{t.chatPage.thinking}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 md:py-4">
          {/* Limit Warning */}
          {!isPremium && messagesRemaining === 0 && session?.resetAt && (
            <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    {t.chatPage.limitReached}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    {t.chatPage.newQuotaIn} {
                      (() => {
                        const resetDate = new Date(session.resetAt);
                        const now = new Date();
                        const diffMs = resetDate.getTime() - now.getTime();
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
                      })()
                    }
                  </p>
                </div>
                <Link href="/subscription">
                  <Button size="sm" className="w-full md:w-auto" data-testid="button-upgrade-from-limit">
                    <Crown className="w-3 h-3 mr-1" />
                    {t.chatPage.premiumBadge}
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Input */}
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.chatPage.placeholder}
              className="flex-1 min-h-[44px] max-h-[200px] resize-none rounded-xl border-muted-foreground/20 focus-visible:ring-1"
              disabled={sendMessageMutation.isPending || (!isPremium && messagesRemaining === 0)}
              data-testid="input-message"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending || (!isPremium && messagesRemaining === 0)}
              size="icon"
              className="h-[44px] w-[44px] rounded-xl flex-shrink-0"
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
            {t.chatPage.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
