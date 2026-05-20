import React from 'react';
import PropertiesSection from '../components/PropertiesSection';

export default function PropertiesPage() {
  return (
    <main className="min-h-screen pt-28">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold neon mb-6">Properties</h1>
      </div>
      <PropertiesSection />
    </main>
  );
}
