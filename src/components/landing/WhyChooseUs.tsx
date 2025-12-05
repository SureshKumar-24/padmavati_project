const keyPoints = [
  {
    icon: '🏭',
    title: 'Manufacturing Experience',
    description: 'Over 25 years of expertise in brass and copper craftsmanship',
  },
  {
    icon: '👨‍🎨',
    title: 'Skilled Artisans',
    description: 'Master craftsmen with generations of traditional knowledge',
  },
  {
    icon: '🥇',
    title: 'High-Grade Materials',
    description: 'Only premium quality brass, copper, and panchdhatu alloys',
  },
  {
    icon: '✨',
    title: 'Durable Polish',
    description: 'Long-lasting finish that maintains its shine for years',
  },
  {
    icon: '🔍',
    title: 'International Quality Checks',
    description: 'Rigorous quality control meeting global standards',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Why Choose Us
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Trusted by thousands of customers across India
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {keyPoints.map((point) => (
            <div key={point.title} className="text-center p-6 bg-white rounded-xl shadow-sm">
              <span className="text-4xl mb-4 block">{point.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
