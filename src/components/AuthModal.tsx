import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { CONFIG, getAuthRedirectUrl, supabase } from '../lib/supabase';
import { isValidEmail, isValidName, isValidSouthAfricanPhone } from '../lib/formValidation';
import { isOwnerEmail } from '../lib/ownerAccess';
import { X, Lock, Mail, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

const getAuthErrorMessage = (error: unknown, action: string): string => {
  if (error instanceof Error && /email not confirmed|email_not_confirmed/i.test(
    `${error.message} ${'code' in error ? error.code : ''}`
  )) {
    return 'Please confirm your email first';
  }
  if (error instanceof Error && /failed to fetch|network request failed|networkerror/i.test(error.message)) {
    return `Could not reach Supabase Auth at ${new URL(CONFIG.SUPABASE_URL).host}. Verify the project URL and that the Supabase project is active, then try again.`;
  }
  if (error instanceof Error && /invalid login credentials/i.test(error.message)) {
    return 'Email or password is incorrect. Confirm the email is verified and that this account exists in the configured Supabase project. If the details are correct, verify the storefront is connected to the intended project.';
  }
  return error instanceof Error ? error.message : `${action} failed. Please check your connection and try again.`;
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  onOwnerLogin: () => void;
  onOpenAdmin: () => void;
  onAuthSuccess: () => void;
  initialError?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  onOwnerLogin,
  onOpenAdmin,
  onAuthSuccess,
  initialError
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(initialError ?? '');
      setSuccessMsg('');
    }
  }, [isOpen, initialError]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!isValidEmail(email)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Enter your password.');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        throw error;
      }

      console.log('session', data.session);
      if (!data.session) {
        setErrorMsg('Please confirm your email first');
        return;
      }

      setUser(data.session.user);
      if (isOwnerEmail(data.session.user.email)) {
        setSuccessMsg('Admin login verified. Opening the admin dashboard.');
        setTimeout(() => {
          onClose();
          onOwnerLogin();
        }, 500);
        return;
      }
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
        onAuthSuccess();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(getAuthErrorMessage(err, 'Login'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const normalizedEmail = email.trim().toLowerCase();
    if (isOwnerEmail(normalizedEmail)) {
      setErrorMsg('The admin account cannot be created through public signup. Sign in, or have the owner reset the password in Supabase.');
      return;
    }
    if (!isValidName(fullName)) {
      setErrorMsg('Enter a name between 2 and 100 characters.');
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    if (!isValidSouthAfricanPhone(phone)) {
      setErrorMsg('Enter a valid South African phone number.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Your password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('The passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
          data: {
            full_name: fullName.trim(),
            phone: phone.trim()
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.session && data.user) {
        setUser(data.user);
        setSuccessMsg('Check your email! Confirmation link is valid for 1 hour and can only be used once.');
        setTimeout(() => {
          onClose();
          onAuthSuccess();
        }, 1200);
      } else {
        setSuccessMsg('Check your email! Confirmation link is valid for 1 hour and can only be used once.');
      }
    } catch (err: unknown) {
      setErrorMsg(getAuthErrorMessage(err, 'Registration'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMsg(`Unable to sign out: ${error.message}`);
      return;
    }
    setUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* User is already logged in */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block">
              {isOwnerEmail(user.email) ? 'BROERHOOD36 ADMIN' : 'BROERHOOD36 MEMBER'}
              </span>
              <h3 className="font-heading font-black text-2xl text-white mt-1">
                {user.email}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isOwnerEmail(user.email) ? 'Admin session verified.' : 'Session active across your devices.'}
              </p>
            </div>
            {isOwnerEmail(user.email) && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Open Admin Dashboard
              </button>
            )}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-400 hover:text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of BROERHOOD36</span>
            </button>
          </div>
        ) : (
          /* Login / Signup Form */
          <>
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                AUTHENTIC SOUTH AFRICAN MARKETPLACE
              </span>
              <h2 className="font-heading font-black text-2xl text-white">
                {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
              </h2>
              <p className="text-xs text-slate-400">
                {isLogin
                  ? 'Sign in to access order tracking and saved wishlists.'
                  : 'Join Broerhood36 to unlock member drops and rental bookings.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4 text-xs">
              {!isLogin && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sipho Ndlovu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">South African Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    autoComplete="tel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sipho@example.co.za"
                    autoComplete="email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={isLogin ? undefined : 8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-heading font-black text-xs bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-xl shadow-blue-900/30 transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Processing...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                  setSuccessMsg('');
                  setConfirmPassword('');
                }}
                className="text-blue-400 hover:text-white font-bold ml-1 underline"
              >
                {isLogin ? 'Sign up here' : 'Sign in'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
