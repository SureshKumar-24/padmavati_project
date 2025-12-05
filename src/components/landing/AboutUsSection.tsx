import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function AboutUsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">About Us</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We are a family-owned business with over two decades of experience in crafting
            exquisite brass and copper idols. Our journey began in the heart of India&apos;s
            traditional metalworking region, where generations of artisans have perfected the art
            of creating divine statues that bring peace and prosperity to homes and temples.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Every piece we create is a testament to our commitment to quality, authenticity, and
            the preservation of ancient craftsmanship techniques passed down through generations.
          </p>
          <Link href="/about">
            <Button variant="outline">Learn More About Us</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
