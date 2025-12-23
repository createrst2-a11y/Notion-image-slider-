
import React, { useState } from 'react';
import { SliderConfig, SliderMode, AspectRatio, ObjectFit, DEFAULT_FILTERS, ImageItem, SlideDirection, TransitionStyle } from '../types';
import { X, Plus, Trash2, Settings, ExternalLink, Image as ImageIcon, SlidersHorizontal, ChevronUp, ChevronDown, MoveLeft, MoveRight, RotateCw, Layers } from 'lucide-react';

interface EditorProps {
  config: SliderConfig;
  onChange: (config: SliderConfig) => void;
  onClose: () => void;
}

const Editor: React.FC<EditorProps> = ({ config, onChange, onClose }) => {
  const [newUrl, setNewUrl] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateConfig = (key: keyof SliderConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const addImage = () => {
    if (newUrl.trim()) {
      updateConfig('images', [...config.images, { url: newUrl.trim(), ...DEFAULT_FILTERS }]);
      setNewUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...config.images];
    newImages.splice(index, 1);
    updateConfig('images', newImages);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...config.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    updateConfig('images', newImages);
    
    if (expandedIndex === index) setExpandedIndex(targetIndex);
    else if (expandedIndex === targetIndex) setExpandedIndex(index);
  };

  const updateImageProperty = (index: number, key: keyof ImageItem, value: any) => {
    const newImages = [...config.images];
    newImages[index] = { ...newImages[index], [key]: value };
    updateConfig('images', newImages);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL copied! Paste this into your Notion embed block.');
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <div className="w-full max-w-sm bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Settings size={18} className="text-blue-600" />
            Slider Settings
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {/* Transitions Settings */}
          <section className="space-y-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
              <RotateCw size={14} /> Motion & Direction
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500 font-medium">Flow Direction</label>
                <div className="flex bg-white p-1 rounded-lg border border-blue-100 shadow-sm">
                  <button 
                    onClick={() => updateConfig('direction', SlideDirection.LTR)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${config.direction === SlideDirection.LTR ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Images enter from Left"
                  >
                    <MoveRight size={14} /> LTR
                  </button>
                  <button 
                    onClick={() => updateConfig('direction', SlideDirection.RTL)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${config.direction === SlideDirection.RTL ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Images enter from Right"
                  >
                    <MoveLeft size={14} /> RTL
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500 font-medium">Effect Style</label>
                <select 
                  value={config.transitionStyle}
                  onChange={(e) => updateConfig('transitionStyle', e.target.value)}
                  className="w-full bg-white border border-blue-100 rounded-lg px-2 py-1.5 text-xs font-medium shadow-sm outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value={TransitionStyle.STANDARD}>Standard Slide</option>
                  <option value={TransitionStyle.WHEEL}>Circular (3D Wheel)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Images Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} /> Images ({config.images.length})
            </h3>
            <div className="space-y-2">
              {config.images.map((item, idx) => (
                <div key={idx} className="flex flex-col bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                  <div className="flex gap-1.5 items-center p-2">
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-0.5 rounded transition-colors ${idx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600 hover:bg-white'}`}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === config.images.length - 1}
                        className={`p-0.5 rounded transition-colors ${idx === config.images.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600 hover:bg-white'}`}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0 shadow-inner">
                      <img 
                        src={item.url} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        style={{ filter: `grayscale(${item.grayscale}%) sepia(${item.sepia}%) brightness(${item.brightness}%) contrast(${item.contrast}%)` }}
                      />
                    </div>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateImageProperty(idx, 'url', e.target.value)}
                      className="flex-1 bg-transparent text-xs text-gray-600 outline-none truncate font-medium"
                      placeholder="Image URL"
                    />
                    <button 
                      onClick={() => toggleExpand(idx)} 
                      className={`p-1.5 rounded-md transition-colors ${expandedIndex === idx ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-white'}`}
                      title="Adjust filters"
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                    <button onClick={() => removeImage(idx)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-white rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {expandedIndex === idx && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-100 space-y-3 bg-white/50 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Grayscale</span>
                            <span>{item.grayscale}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={item.grayscale} 
                            onChange={(e) => updateImageProperty(idx, 'grayscale', Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Sepia</span>
                            <span>{item.sepia}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={item.sepia} 
                            onChange={(e) => updateImageProperty(idx, 'sepia', Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Brightness</span>
                            <span>{item.brightness}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={item.brightness} 
                            onChange={(e) => updateImageProperty(idx, 'brightness', Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Contrast</span>
                            <span>{item.contrast}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={item.contrast} 
                            onChange={(e) => updateImageProperty(idx, 'contrast', Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  onClick={addImage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Display settings */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} /> Appearance
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Play Mode</label>
                <select 
                  value={config.mode}
                  onChange={(e) => updateConfig('mode', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium"
                >
                  <option value={SliderMode.CAROUSEL}>Carousel</option>
                  <option value={SliderMode.LINEAR}>Linear List</option>
                  <option value={SliderMode.FADE}>Crossfade</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Aspect Ratio</label>
                <select 
                  value={config.aspectRatio}
                  onChange={(e) => updateConfig('aspectRatio', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium"
                >
                  <option value={AspectRatio.AUTO}>Auto</option>
                  <option value={AspectRatio.LANDSCAPE}>16:9 Landscape</option>
                  <option value={AspectRatio.SQUARE}>1:1 Square</option>
                  <option value={AspectRatio.PORTRAIT}>4:5 Portrait</option>
                  <option value={AspectRatio.CLASSIC}>4:3 Classic</option>
                  <option value={AspectRatio.CUSTOM}>Custom Ratio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Image Fit</label>
                <select 
                  value={config.objectFit}
                  onChange={(e) => updateConfig('objectFit', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium"
                >
                  <option value={ObjectFit.COVER}>Cover</option>
                  <option value={ObjectFit.CONTAIN}>Contain</option>
                  <option value={ObjectFit.FILL}>Fill</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Rounding (px)</label>
                <input 
                  type="number"
                  value={config.borderRadius}
                  onChange={(e) => updateConfig('borderRadius', Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-700 font-bold uppercase tracking-tight">Auto Play</span>
              <button 
                onClick={() => updateConfig('autoPlay', !config.autoPlay)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${config.autoPlay ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.autoPlay ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {config.autoPlay && (
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Hold Duration (ms)</label>
                <input 
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={config.interval}
                  onChange={(e) => updateConfig('interval', Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-[10px] text-gray-400 text-right font-mono">{config.interval}ms</div>
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interface</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={config.showArrows} onChange={() => updateConfig('showArrows', !config.showArrows)} className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Show Arrows</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={config.showDots} onChange={() => updateConfig('showDots', !config.showDots)} className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Show Dots</span>
              </label>
            </div>
          </section>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
          <button 
            onClick={copyUrl}
            className="w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ExternalLink size={14} />
            Copy Widget URL for Notion
          </button>
          <p className="text-[10px] text-gray-400 text-center leading-tight">
            Configure once, copy URL, and embed in Notion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
