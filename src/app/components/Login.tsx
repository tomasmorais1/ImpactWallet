import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Wallet, Mail, Facebook, Instagram } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login - in production this would integrate with OAuth
    onLogin(`user@${provider}.com`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-4">
      {/* Logo Header */}
      <div className="text-center pt-12 pb-8">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-2xl">
            <Wallet className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Impact Wallet</h1>
        <p className="text-emerald-100 text-sm">Save money, earn rewards, make an impact</p>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-start justify-center">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignup ? 'Sign up to start saving and earning points' : 'Sign in to continue saving'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSignup ? 'Sign Up with Email' : 'Sign In with Email'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12"
                onClick={() => handleSocialLogin('google')}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12"
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" />
                Continue with Facebook
              </Button>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12"
                onClick={() => handleSocialLogin('instagram')}
              >
                <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                Continue with Instagram
              </Button>
            </div>

            {/* Toggle Sign In/Sign Up */}
            <div className="text-center pt-4 text-sm">
              <button 
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 pt-4">
        <p className="text-emerald-100 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
