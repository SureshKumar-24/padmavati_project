import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  const whatsappNumber = '919876543210'; // Replace with actual number
  const whatsappMessage = encodeURIComponent('Hi, I am interested in your brass and copper idols.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
          Bring Home the Perfect Statue Today
        </h2>
        <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
          Explore our collection of handcrafted brass and copper idols, or reach out to us for
          custom orders and bulk inquiries.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              Browse All Products
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Contact via WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
