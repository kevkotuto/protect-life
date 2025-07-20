'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-20 w-20'
};

export function Logo({ 
  className, 
  size = 'md', 
  showText = true, 
  textClassName 
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logo.png"
        alt="Protect Life Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 80}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 80}
        className={cn(sizeClasses[size], 'object-contain')}
        priority
      />
      {showText && (
        <span className={cn(
          'font-bold text-gray-900',
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl',
          textClassName
        )}>
          Protect Life
        </span>
      )}
    </div>
  );
} 