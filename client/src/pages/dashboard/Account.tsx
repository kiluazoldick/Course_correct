import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Camera, Check, X, Globe, Sun, Moon, Users, Copy, Gift, CheckCircle, Crown, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { PremiumBadge } from '@/components/PremiumBadge';
import { getErrorMessage } from '@/lib/errorHandler';
import { updateUserProfileSchema, type UpdateUserProfile } from '@shared/schema';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import type { Language } from '@/lib/i18n/translations';
import { useTheme } from '@/components/ThemeProvider';

interface ProfileResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    createdAt: string;
  };
  plan: 'free' | 'premium';
  subscription: any;
}

interface ReferralResponse {
  referralCode: string;
  referralLink: string;
  referralsCount: number;
  referrals: Array<{
    id: string;
    referredName: string;
    status: string;
    createdAt: string;
  }>;
}

export default function Account() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [copied, setCopied] = useState(false);

  // Fetch profile with plan information
  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['/api/user/profile'],
  });

  // Fetch referral info
  const { data: referralData, isLoading: referralLoading } = useQuery<ReferralResponse>({
    queryKey: ['/api/referral'],
  });

  const plan = profileData?.plan || 'free';

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      toast({
        title: language === 'fr' ? 'Lien copié !' : 'Link copied!',
        description: language === 'fr' 
          ? 'Partage-le avec tes amis pour gagner 14 jours Premium gratuits !'
          : 'Share it with your friends to earn 14 free Premium days!',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      const response = await apiRequest('PUT', '/api/user/profile', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t.success.updated,
        description: language === 'fr' ? "Vos informations ont été modifiées avec succès" : "Your information has been successfully updated",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: t.errors.generic,
        description: getErrorMessage(error, language),
        variant: "destructive",
      });
    },
  });

  // Update language mutation
  const updateLanguageMutation = useMutation({
    mutationFn: async (newLanguage: Language) => {
      const response = await apiRequest('PUT', '/api/user/language', { language: newLanguage });
      return await response.json();
    },
    onSuccess: (_, newLanguage) => {
      setLanguage(newLanguage);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: newLanguage === 'fr' ? "Langue mise à jour" : "Language updated",
        description: newLanguage === 'fr' ? "La langue a été changée en français" : "Language has been changed to English",
      });
    },
    onError: (error: any) => {
      toast({
        title: t.errors.generic,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/user/profile/photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: language === 'fr' ? "Photo mise à jour" : "Photo updated",
        description: language === 'fr' ? "Votre photo de profil a été modifiée avec succès" : "Your profile photo has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: t.errors.generic,
        description: error.message || (language === 'fr' ? "Impossible de mettre à jour la photo" : "Unable to update photo"),
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    const validation = updateUserProfileSchema.safeParse({ firstName, lastName });
    if (!validation.success) {
      toast({
        title: language === 'fr' ? "Erreur de validation" : "Validation error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ firstName, lastName });
  };

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage !== language) {
      updateLanguageMutation.mutate(newLanguage);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: language === 'fr' ? "Fichier trop volumineux" : "File too large",
        description: language === 'fr' ? "La photo ne doit pas dépasser 2 MB" : "Photo must not exceed 2 MB",
        variant: "destructive",
      });
      return;
    }

    uploadPhotoMutation.mutate(file);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      queryClient.setQueryData(['/api/auth/user'], null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-account-title">{t.account.title}</h2>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">{t.account.subtitle}</p>
        </div>
        {plan === 'premium' && (
          <PremiumBadge size="md" />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.account.profile.title}</CardTitle>
              <CardDescription>
                {plan === 'free' ? t.subscription.free : t.subscription.premium}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                data-testid="button-edit-profile"
              >
                {t.edit}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profileImageUrl || undefined} alt="Photo de profil" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhotoMutation.isPending}
                data-testid="button-change-photo"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
                data-testid="input-photo-upload"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate" data-testid="text-user-name">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : (language === 'fr' ? 'Utilisateur' : 'User')}
              </p>
              <p className="text-sm text-muted-foreground truncate" data-testid="text-user-email">
                {user?.email}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">{t.account.profile.firstName}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={language === 'fr' ? "Votre prénom" : "Your first name"}
                  data-testid="input-firstname"
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t.account.profile.lastName}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={language === 'fr' ? "Votre nom" : "Your last name"}
                  data-testid="input-lastname"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-profile"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? t.account.profile.saving : t.account.profile.save}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-cancel-edit"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.account.profile.email}</label>
                <p className="text-sm text-muted-foreground" data-testid="text-email-value">
                  {user?.email || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">{t.account.profile.firstName}</label>
                <p className="text-sm text-muted-foreground" data-testid="text-firstname-value">
                  {user?.firstName || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">{t.account.profile.lastName}</label>
                <p className="text-sm text-muted-foreground" data-testid="text-lastname-value">
                  {user?.lastName || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">{language === 'fr' ? "Date d'inscription" : "Registration date"}</label>
                <p className="text-sm text-muted-foreground" data-testid="text-join-date">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : (language === 'fr' ? 'Non disponible' : 'Not available')}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
              data-testid="button-logout-account"
            >
              {t.nav.logout}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card - Important for mobile users */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <CardTitle>{language === 'fr' ? 'Abonnement' : 'Subscription'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {plan === 'premium' ? (
                <Crown className="w-5 h-5 text-primary" />
              ) : (
                <Sparkles className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium" data-testid="text-current-plan">
                  {plan === 'premium' 
                    ? (language === 'fr' ? 'Premium' : 'Premium')
                    : (language === 'fr' ? 'Gratuit' : 'Free')}
                </p>
                {plan === 'premium' && <PremiumBadge size="sm" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {plan === 'premium'
                  ? (language === 'fr' ? 'Accès illimité' : 'Unlimited access')
                  : (language === 'fr' ? '2 cours/mois' : '2 courses/month')}
              </p>
            </div>
          </div>

          {plan === 'free' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{language === 'fr' ? 'Premium' : 'Premium'}</span>
                <span className="font-semibold">500 XAF <span className="text-muted-foreground font-normal">/ 1 USD</span></span>
              </div>
              <Link href="/subscription">
                <Button className="w-full" data-testid="button-upgrade-premium">
                  <Crown className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Passer à Premium' : 'Upgrade to Premium'}
                </Button>
              </Link>
            </div>
          )}

          {plan === 'premium' && (
            <p className="text-sm text-center text-muted-foreground">
              {language === 'fr' 
                ? 'Merci de soutenir Corrige Tes Cours !' 
                : 'Thank you for supporting Corrige Tes Cours!'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.account.preferences.title}</CardTitle>
          <CardDescription>
            {language === 'fr' ? "Personnalisez votre expérience" : "Personalize your experience"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Preference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">{t.account.preferences.language}</label>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.account.preferences.languageDesc}
            </p>
            <div className="flex gap-2">
              <Button
                variant={language === 'fr' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('fr')}
                disabled={updateLanguageMutation.isPending}
                className="flex-1"
                data-testid="button-lang-fr"
              >
                <span className="mr-2">🇫🇷</span>
                {t.account.preferences.french}
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('en')}
                disabled={updateLanguageMutation.isPending}
                className="flex-1"
                data-testid="button-lang-en"
              >
                <span className="mr-2">🇬🇧</span>
                {t.account.preferences.english}
              </Button>
            </div>
          </div>

          {/* Theme Preference */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
              <label className="text-sm font-medium">{t.account.preferences.theme}</label>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.account.preferences.themeDesc}
            </p>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex-1"
                data-testid="button-theme-light"
              >
                <Sun className="w-4 h-4 mr-2" />
                {t.account.preferences.light}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex-1"
                data-testid="button-theme-dark"
              >
                <Moon className="w-4 h-4 mr-2" />
                {t.account.preferences.dark}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle>{language === 'fr' ? 'Parrainage' : 'Referrals'}</CardTitle>
          </div>
          <CardDescription>
            {language === 'fr' 
              ? 'Invite tes amis et gagne 14 jours Premium gratuits par parrainage !'
              : 'Invite your friends and earn 14 free Premium days per referral!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {referralLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : referralData ? (
            <>
              {/* Referral Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  {language === 'fr' ? 'Ton lien de parrainage' : 'Your referral link'}
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={referralData.referralLink}
                    className="font-mono text-sm"
                    data-testid="input-referral-link"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    data-testid="button-copy-referral"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr'
                    ? `Code: ${referralData.referralCode}`
                    : `Code: ${referralData.referralCode}`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary" data-testid="text-referral-count">
                    {referralData.referralsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Parrainages' : 'Referrals'}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-days-earned">
                    {referralData.referralsCount * 14}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Jours gagnés' : 'Days earned'}
                  </p>
                </div>
              </div>

              {/* Recent Referrals */}
              {referralData.referrals.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'fr' ? 'Tes filleuls récents' : 'Your recent referrals'}
                  </label>
                  <div className="space-y-2">
                    {referralData.referrals.slice(0, 5).map((ref) => (
                      <div 
                        key={ref.id} 
                        className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                        data-testid={`referral-item-${ref.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{ref.referredName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            +14 {language === 'fr' ? 'jours' : 'days'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(ref.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {language === 'fr' ? 'Impossible de charger les données de parrainage' : 'Unable to load referral data'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
