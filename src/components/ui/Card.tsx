import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hoverable = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl overflow-hidden';

    const variants = {
      default: 'bg-white',
      elevated: 'bg-white shadow-lg',
      bordered: 'bg-white border border-gray-200',
    };

    const hoverStyles = hoverable
      ? 'transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export function CardImage({ src, alt, aspectRatio = 'square', className = '' }: CardImageProps) {
  const aspectRatios = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
  };

  return (
    <div className={`relative ${aspectRatios[aspectRatio]} ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

export function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card };
