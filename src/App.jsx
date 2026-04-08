import { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import Dashboard from './components/Dashboard';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isDarkMode] = useState(true); // Dashboard is always dark

  return (
    <>
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}
      {!showIntro && (
        <Dashboard isDarkMode={isDarkMode} />
      )}
    </>
  );
}

export default App;
