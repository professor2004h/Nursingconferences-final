'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavigationTest() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    router.push(path);
  };

  return (
    <div className="fixed top-4 left-4 z-[200] bg-yellow-500 text-black p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Navigation Test</h3>
      <div className="space-y-2">
        <div>
          <Link 
            href="/" 
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Link clicked: Home')}
          >
            🏠 Home (Link)
          </Link>
        </div>
        <div>
          <button 
            onClick={() => handleNavigation('/')}
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100 w-full text-left"
          >
            🏠 Home (Button)
          </button>
        </div>
        <div>
          <Link 
            href="/brochure" 
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Link clicked: Brochure')}
          >
            📄 Brochure (Link)
          </Link>
        </div>
        <div>
          <button 
            onClick={() => handleNavigation('/brochure')}
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100 w-full text-left"
          >
            📄 Brochure (Button)
          </button>
        </div>
        <div>
          <Link 
            href="/contact" 
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Link clicked: Contact')}
          >
            📞 Contact (Link)
          </Link>
        </div>
        <div>
          <button 
            onClick={() => handleNavigation('/contact')}
            className="block bg-white px-2 py-1 rounded text-sm hover:bg-gray-100 w-full text-left"
          >
            📞 Contact (Button)
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs">
        Check console for click events
      </div>
    </div>
  );
}
