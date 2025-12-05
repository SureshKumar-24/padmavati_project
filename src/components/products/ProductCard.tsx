import { Product } from '@/types';
import { Card, CardImage, CardContent } from '@/components/ui/Card';

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card variant="bordered" hoverable onClick={onClick}>
      <CardImage
        src={product.images[0] || '/images/placeholder.jpg'}
        alt={product.name}
        aspectRatio="square"
      />
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 text-sm sm:text-base">{product.name}</h3>
        <p className="text-lg sm:text-xl font-bold text-amber-600 mb-2 sm:mb-3">{formatPrice(product.price)}</p>
        <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Weight:</span> {product.weightKg} kg
          </p>
          <p>
            <span className="font-medium">Height:</span> {product.heightInch}&quot;
          </p>
          <p>
            <span className="font-medium">Finish:</span> {product.finishType}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
