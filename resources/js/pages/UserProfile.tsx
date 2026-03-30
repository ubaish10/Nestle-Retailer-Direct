import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Calendar, Save, ArrowLeft, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string | null;
        address?: string | null;
        city?: string | null;
        created_at: string;
    };
}

export default function UserProfile({ user }: Props) {
    const { toast } = useToast();
    const page = usePage();
    const authUser = (page.props.auth as any)?.user;
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const passwordSectionRef = useRef<HTMLDivElement>(null);

    // Scroll to password section when it becomes visible
    useEffect(() => {
        if (showPasswordForm && passwordSectionRef.current) {
            passwordSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showPasswordForm]);

    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        profileForm.put('/user/profile-information', {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Profile updated',
                    description: 'Your profile information has been saved successfully.',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Update failed',
                    description: Object.values(errors)[0] || 'There was an error updating your profile.',
                    variant: 'destructive',
                });
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        passwordForm.put('/user/password', {
            onSuccess: () => {
                toast({
                    title: 'Password updated',
                    description: 'Your password has been changed successfully.',
                });
                passwordForm.reset();
                setShowPasswordForm(false);
            },
            onError: (errors) => {
                toast({
                    title: 'Update failed',
                    description: Object.values(errors)[0] || 'There was an error changing your password.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <>
            <Head title="My Profile" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00447C] via-[#003d6f] to-[#00284a] text-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">My Profile</h1>
                                <p className="text-white/70 text-sm">Manage your account information</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Profile Card */}
                    <Card className="mb-6 bg-white/90 dark:bg-white/10 border-white/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00447C] to-[#003d6f] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-blue-600 transition-colors">
                                        <Camera className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                
                                {/* User Info */}
                                <div className="text-center sm:text-left flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Profile Form */}
                    <Card className="bg-white/90 dark:bg-white/10 border-white/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Profile Information</CardTitle>
                                <CardDescription>Update your personal details and contact information</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="border-gray-300"
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                {showPasswordForm ? 'Cancel' : 'Change Password'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className="bg-white/50 dark:bg-white/5"
                                        />
                                        {profileForm.errors.name && (
                                            <p className="text-sm text-red-500">{profileForm.errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            disabled
                                            className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-500">Email cannot be changed</p>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={profileForm.data.phone || ''}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                            className="bg-white/50 dark:bg-white/5"
                                        />
                                        {profileForm.errors.phone && (
                                            <p className="text-sm text-red-500">{profileForm.errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </Label>
                                        <Input
                                            id="address"
                                            value={profileForm.data.address || ''}
                                            disabled
                                            className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-500">Address cannot be changed</p>
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            City
                                        </Label>
                                        <Input
                                            id="city"
                                            value={profileForm.data.city || ''}
                                            disabled
                                            className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-500">City cannot be changed</p>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4 border-t">
                                    <Button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="bg-gradient-to-r from-[#00447C] to-[#003d6f] hover:from-[#003d6f] hover:to-[#00284a]"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>

                            {/* Change Password Form */}
                            {showPasswordForm && (
                                <div ref={passwordSectionRef}>
                                    <div className="border-t my-6"></div>
                                    <div className="space-y-2 mb-4">
                                        <h3 className="text-base font-semibold flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Change Password
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                                    </div>
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Current Password */}
                                            <div className="space-y-2">
                                                <Label htmlFor="current_password">Current Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="current_password"
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.current_password}
                                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                        placeholder="Enter current password"
                                                        className="bg-white/50 dark:bg-white/5 pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {passwordForm.errors.current_password && (
                                                    <p className="text-sm text-red-500">{passwordForm.errors.current_password}</p>
                                                )}
                                            </div>

                                            {/* New Password */}
                                            <div className="space-y-2">
                                                <Label htmlFor="password">New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password}
                                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                        placeholder="Enter new password"
                                                        className="bg-white/50 dark:bg-white/5 pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {passwordForm.errors.password && (
                                                    <p className="text-sm text-red-500">{passwordForm.errors.password}</p>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password_confirmation}
                                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm new password"
                                                        className="bg-white/50 dark:bg-white/5 pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {passwordForm.errors.password_confirmation && (
                                                    <p className="text-sm text-red-500">{passwordForm.errors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password Submit Button */}
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    passwordForm.reset();
                                                    setShowPasswordForm(false);
                                                }}
                                                disabled={passwordForm.processing}
                                                className="border-gray-300"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={passwordForm.processing}
                                                className="bg-gradient-to-r from-[#00447C] to-[#003d6f] hover:from-[#003d6f] hover:to-[#00284a]"
                                            >
                                                <Lock className="h-4 w-4 mr-2" />
                                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Info Card */}
                    <Card className="mt-6 bg-white/90 dark:bg-white/10 border-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Account Details</CardTitle>
                            <CardDescription>Your account information and statistics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Account Type</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                        {authUser?.role || 'Retailer'}
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">User ID</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                        #{user.id}
                                    </div>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {new Date(user.created_at).getFullYear()}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
