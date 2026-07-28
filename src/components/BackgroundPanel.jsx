import { useState } from 'react';

export default function BackgroundPanel({ bgColor, setBgColor, onImageChange }) {
  const [mode, setMode] = useState('color');
  const [isDrag, setIsDrag] = useState(false);

  const chooseMode = (m) => {
    setMode(m);
    if (m === 'color') onImageChange(null);
  };

  // Prevent default browser behavior (which opens the image in a new tab)
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDrag(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    
    // Grab the dropped file
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Background</h2>
      <div className="tabbtns">
        <button 
          className={mode === 'color' ? 'active' : ''} 
          onClick={() => chooseMode('color')}
        >
          Color
        </button>
        <button 
          className={mode === 'image' ? 'active' : ''} 
          onClick={() => chooseMode('image')}
        >
          Image
        </button>
      </div>

      {mode === 'color' && (
        <div className="row">
          <label>Fill color</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={e => setBgColor(e.target.value)} 
          />
          <span className="val">{bgColor}</span>
        </div>
      )}

      {mode === 'image' && (
        <div 
          className="row"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDrag ? '2px dashed #00e676' : '2px dashed #888',
            backgroundColor: isDrag ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
            padding: '40px 20px',
            textAlign: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            marginTop: '10px'
          }}
        >
          {/* We wrap the text in the label to make the whole area clickable */}
          <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
            {isDrag ? 'Drop image here...' : 'Drop or select your image'}
          </label>
          
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: 'none' }} // Hide the native file input UI
            onChange={e => {
              const file = e.target.files[0];
              if (file) onImageChange(URL.createObjectURL(file));
            }}
          />
        </div>
      )}
    </div>
  );
}