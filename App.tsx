
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SliderConfig } from './types';
import { decodeConfig, encodeConfig } from './utils/state';
import Slider from './components/Slider';
import Editor from './components/Editor';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<SliderConfig>(() => decodeConfig(window.location.hash));
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Sync state with URL hash
  useEffect(() => {
    const newHash = encodeConfig(config);
    window.location.hash = newHash;
  }, [config]);

  // Handle back/forward navigation or manual hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setConfig(decodeConfig(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Function to handle timer reset - defined outside useEffect correctly
  const resetTimer = useCallback(() => {
    setIsButtonVisible(true);
    
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    
    // Only set the hide timer if not in editing mode
    if (!isEditing) {
      timerRef.current = window.setTimeout(() => {
        setIsButtonVisible(false);
      }, 3000);
    }
  }, [isEditing]);

  // Listen for user interactions to show/hide the settings button
  useEffect(() => {
    resetTimer();

    const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    const handleInteraction = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleInteraction));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleInteraction));
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-2 sm:p-4 bg-transparent group/app">
      {/* Settings Trigger - Hides after 3s, reappears on tap */}
      {!isEditing && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={`fixed top-4 right-4 z-50 p-2.5 bg-white/80 hover:bg-white backdrop-blur-md shadow-lg border border-gray-200/50 rounded-full text-gray-500 hover:text-blue-600 transition-all duration-500 ${
            isButtonVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          } active:scale-90`}
          title="Slider Settings"
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>
      )}

      {/* The main slider container */}
      <div className="w-full max-w-4xl mx-auto relative">
        <Slider config={config} />
        
        {/* Helper overlay when empty */}
        {config.images.length === 0 && !isEditing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-[2px] rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-blue-500">
              <Settings size={32} className="animate-spin-slow" style={{ animationDuration: '8s' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Setup Your Carousel</h2>
            <p className="text-gray-500 max-w-xs mb-6">Add your images and customize the look for your Notion page.</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all font-semibold flex items-center gap-2"
            >
              <Settings size={18} />
              Open Settings
            </button>
          </div>
        )}
      </div>

      {/* Overlay Editor */}
      {isEditing && (
        <Editor 
          config={config} 
          onChange={setConfig} 
          onClose={() => {
            setIsEditing(false);
            setIsButtonVisible(true);
          }} 
        />
      )}
      
      {/* Interaction layer to trigger settings visibility on background tap */}
      {!isEditing && config.images.length > 0 && (
        <div 
          className="fixed inset-0 z-0"
          onClick={resetTimer}
        />
      )}
    </div>
  );
};

export default App;
