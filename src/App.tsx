import { useState } from 'react';
import { Home } from './components/Home';
import { IssueCertificate } from './components/IssueCertificate';
import { Navigation } from './components/Navigation';

type Page = 'home' | 'issue';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="pb-8">
        {currentPage === 'home' && <Home />}
        {currentPage === 'issue' && <IssueCertificate />}
      </main>
    </div>
  );
}
