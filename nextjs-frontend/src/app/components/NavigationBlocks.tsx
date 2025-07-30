'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationBlock {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const navigationBlocks: NavigationBlock[] = [
  {
    title: 'Brochure',
    href: '/brochure',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Download conference brochure'
  },
  {
    title: 'Submit Abstract',
    href: '/submit-abstract',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: 'Submit your research abstract'
  },
  {
    title: 'Venue',
    href: '/venue',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Conference location details'
  },
  {
    title: 'Speakers',
    href: '/speakers',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    description: 'Featured conference speakers'
  }
];

const NavigationBlocks: React.FC = () => {
  return (
    <section className="navigation-blocks-section">
      <div className="navigation-blocks-container">
        <div className="navigation-blocks-grid">
          {navigationBlocks.map((block, index) => (
            <Link
              key={index}
              href={block.href}
              className="navigation-block"
              aria-label={`Navigate to ${block.title} - ${block.description}`}
            >
              <div className="navigation-block-content">
                <div className="navigation-block-icon">
                  {block.icon}
                </div>
                <h3 className="navigation-block-title">
                  {block.title}
                </h3>
                <p className="navigation-block-description">
                  {block.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NavigationBlocks;
