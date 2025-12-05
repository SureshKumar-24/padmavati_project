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
      <CardContent>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
        <p className="text-xl font-bold text-amber-600 mb-3">{formatPrice(product.price)}</p>
        <div className="space-y-1 text-sm text-gray-600">
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
