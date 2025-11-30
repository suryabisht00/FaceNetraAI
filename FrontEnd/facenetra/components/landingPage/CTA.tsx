import React from 'react';
import Button from '../ui/Button';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-12 text-center">
          <div className="relative z-10 flex flex-col gap-6 items-center">
            <h2 className="font-poppins text-white text-3xl md:text-4xl font-bold leading-tight max-w-2xl">
              Ready to Transform Your Social Experience?
            </h2>
            <p className="text-[#E5E7EB] text-base md:text-lg font-normal leading-normal max-w-xl">
              Join thousands of users already connecting in the real world with FaceNetra
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Button variant="primary" className="h-14 px-8 text-lg">
                Get Started Free
              </Button>
              <Button variant="secondary" className="h-14 px-8 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
        </div>
      </div>
    </section>
  );
}
