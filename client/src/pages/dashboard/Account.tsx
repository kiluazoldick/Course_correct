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
import { Camera, Check, X, Crown } from 'lucide-react';
import { updateUserProfileSchema, type UpdateUserProfile } from '@shared/schema';

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

export default function Account() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  // Fetch profile with plan information
  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['/api/user/profile'],
  });

  const plan = profileData?.plan || 'free';

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      const response = await apiRequest('PUT', '/api/user/profile', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été modifiées avec succès",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
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
        title: "Photo mise à jour",
        description: "Votre photo de profil a été modifiée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la photo",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    const validation = updateUserProfileSchema.safeParse({ firstName, lastName });
    if (!validation.success) {
      toast({
        title: "Erreur de validation",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ firstName, lastName });
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
        title: "Fichier trop volumineux",
        description: "La photo ne doit pas dépasser 2 MB",
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" data-testid="text-account-title">Mon Compte</h2>
          <p className="text-muted-foreground mt-2">Gérez vos informations personnelles</p>
        </div>
        {plan === 'premium' && (
          <Badge variant="default" className="gap-1" data-testid="badge-premium">
            <Crown className="w-3 h-3" />
            Premium
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                {plan === 'free' ? 'Plan Gratuit' : 'Plan Premium'}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                data-testid="button-edit-profile"
              >
                Modifier
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
            <div>
              <p className="font-semibold" data-testid="text-user-name">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : 'Utilisateur'}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                {user?.email}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  data-testid="input-firstname"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
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
                  {updateProfileMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-cancel-edit"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground" data-testid="text-email-value">
                  {user?.email || 'Non renseigné'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <p className="text-sm text-muted-foreground" data-testid="text-firstname-value">
                  {user?.firstName || 'Non renseigné'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Nom</label>
                <p className="text-sm text-muted-foreground" data-testid="text-lastname-value">
                  {user?.lastName || 'Non renseigné'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Date d'inscription</label>
                <p className="text-sm text-muted-foreground" data-testid="text-join-date">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Non disponible'}
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
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
