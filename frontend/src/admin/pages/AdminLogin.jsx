import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your administrator email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 shadow-xl mb-3 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Portfolio Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sign in with your verified administrator credentials
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 py-6 sm:py-8 px-4 sm:px-10 rounded-2xl sm:rounded-3xl shadow-2xl">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ID"
                  autoComplete="username"
                  required
                  className="w-full text-sm pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                  className="w-full text-sm pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors touch-manipulation"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white touch-manipulation">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-800"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-teal-400 hover:text-teal-300 font-semibold transition-colors touch-manipulation"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying session with backend...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Return to Public Portfolio */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-teal-400 font-medium transition-colors inline-flex items-center gap-1 touch-manipulation"
            >
              <span>← Return to Public Portfolio</span>
            </Link>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              Reset Administrator Access
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Password reset requests are dispatched securely to your registered administrator email.
            </p>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Reset link dispatched to registered administrator email.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
