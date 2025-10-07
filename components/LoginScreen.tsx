import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import Logo from './common/Logo';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError('Invalid email or password.');
            break;
          default:
            setError('An error occurred. Please try again.');
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <Logo className="w-8 h-8 mr-2 text-indigo-600 dark:text-indigo-500" />
        SmartQueue
      </div>
      <div className="w-full bg-white rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
