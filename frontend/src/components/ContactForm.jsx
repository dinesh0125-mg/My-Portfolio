import React, { useState } from 'react';
import { Send, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';
import { contactService } from '../api/contactService';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.trim().length < 8) {
      errs.message = 'Message must be at least 8 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setServerError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    setSubmitted(false);

    try {
      const response = await contactService.submitMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        projectType: 'Direct Recruiter Inquiry',
      });

      /*
       * Backend response must confirm email was sent.
       */
      if (!response?.data?.emailSent) {
        throw new Error(
          response?.message ||
            'Message could not be sent. Please try again later.'
        );
      }

      /*
       * Success
       */
      setSubmitted(true);

      setFormData({
        name: '',
        email: '',
        message: '',
      });

      setErrors({});
    } catch (err) {
      console.error(
        '[ContactForm] Message submission failed:',
        err
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to send your message. Please try again later.';

      /*
       * IMPORTANT:
       *
       * No mailto fallback here.
       *
       * This prevents Gmail / Outlook / mail app
       * from opening when backend email fails.
       */
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      /*
       * Get email from the backend/public contact data if
       * available in your app later.
       *
       * For now this uses the fixed portfolio email.
       */
      await navigator.clipboard.writeText(
        'dineshdinesh48376@gmail.com'
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.warn(
        '[ContactForm] Failed to copy email:',
        error
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-card">

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100">

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Send a Message
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Messages are delivered directly to Dinesh's inbox and admin dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="self-start xs:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-200 transition-colors shrink-0 touch-manipulation"
          title="Copy Email Address to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Email</span>
            </>
          )}
        </button>
      </div>

      {submitted && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2.5 animate-in fade-in duration-200">

          <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />

          <div>
            <p className="font-bold">
              Thank you! Your message has been sent.
            </p>

            <p className="text-teal-700 mt-0.5 break-all">
              Your message has been delivered successfully. Dinesh will get back to you shortly.
            </p>
          </div>

        </div>
      )}

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">

          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />

          <span>{serverError}</span>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Your Name{' '}
            <span className="text-teal-600">*</span>
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. Sarah Jenkins"
            className={`w-full text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all ${
              errors.name
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-200 focus:border-teal-500'
            }`}
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Your Email{' '}
            <span className="text-teal-600">*</span>
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="name@company.com"
            className={`w-full text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all ${
              errors.email
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-200 focus:border-teal-500'
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Message{' '}
            <span className="text-teal-600">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
            placeholder="Hi Dinesh, we would love to discuss an opportunity..."
            className={`w-full text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all resize-none ${
              errors.message
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-200 focus:border-teal-500'
            }`}
          />

          {errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={loading ? Loader2 : Send}
            iconPosition="right"
            disabled={loading}
            className="w-full sm:w-auto text-center justify-center py-3"
          >
            {loading
              ? 'Sending Message...'
              : 'Send Message'}
          </Button>

          <span className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-right">
            Direct response within 24 hours
          </span>

        </div>

      </form>
    </div>
  );
}
