// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar, Edit2, Save, X, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const updated = await userService.updateProfile(profileData);
      updateUser(updated);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      full_name: user?.full_name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Information Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{user?.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{user?.email}</p>
              )}
            </div>

            {/* Role (Read-only) */}
            <div>
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <p className="text-lg font-medium mt-1 uppercase">{user?.role}</p>
            </div>

            {/* Created At (Read-only) */}
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="text-lg font-medium mt-1">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)} variant="outline">
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="old_password">Current Password</Label>
                <Input
                  id="old_password"
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, old_password: e.target.value })
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handlePasswordChange} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setPasswordData({
                      old_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                    setIsChangingPassword(false);
                  }}
                  variant="outline"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
