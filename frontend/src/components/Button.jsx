import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  href,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-2.5 gap-2",
    lg: "text-base px-8 py-3.5 gap-2.5",
  };

  const variantStyles = {
    primary: "bg-[#2EA591] text-white hover:bg-[#248474] shadow-sm hover:shadow-md hover:shadow-brand-500/20 active:scale-[0.98]",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm active:scale-[0.98]",
    mint: "bg-[#E8F8F4] text-[#1E9E88] hover:bg-[#D6F3EB] active:scale-[0.98]",
    outline: "bg-transparent text-[#2EA591] border border-[#2EA591] hover:bg-[#E8F8F4] active:scale-[0.98]",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-[0.98]",
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
