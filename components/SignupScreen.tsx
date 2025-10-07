import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import Logo from './common/Logo';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if(formData.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // User created in Auth, now save profile to Realtime Database
        const user = userCredential.user;
        const userProfileRef = ref(database, `users/${user.uid}`);

        const userProfileData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: user.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
        };

        // Return the promise from set() to chain the catch block
        return set(userProfileRef, userProfileData);
      })
      .catch((err) => {
        switch (err.code) {
            case 'auth/email-already-in-use':
              setError('This email address is already in use.');
              break;
            case 'auth/invalid-email':
              setError('Please enter a valid email address.');
              break;
            case 'auth/weak-password':
              setError('Password is too weak. Please choose a stronger one.');
              break;
            default:
              console.error("Signup Error:", err);
              setError('An error occurred during signup. Please try again.');
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
            Create an account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" type="text" value={formData.firstName} onChange={handleChange} required />
              <Input id="lastName" label="Last Name" type="text" value={formData.lastName} onChange={handleChange} required />
            </div>
            <Input id="email" label="Your email" type="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" required />
            <Input id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} />
            <Input id="password" label="Password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            <Input id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
            
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            
            <Button type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Create account'}</Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                disabled={loading}
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;