import { useState } from 'react';
import { parsePastedCSS } from '../shadowEngine';

export default function PastePanel({ onLoad }) {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleParse = () => {
    if (!text.trim()) {
      setMsg('Paste some CSS first.');
      setIsError(true);
      return;
    }

    const result = parsePastedCSS(text);

    if (result.found) {
      onLoad(result);
      setMsg('Loaded. Sliders below now reflect your pasted CSS.');
      setIsError(false);
    } else {
      setMsg('Could not find background, border-radius, or box-shadow in that CSS.');
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Paste existing CSS</h2>
      <textarea
        placeholder={'background: #d9d9d9;\nbox-shadow:\n    inset -4px -4px 10px rgba(0,0,0,0.25),\n    4px 4px 12px rgba(0,0,0,0.25);'}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button id="parseBtn" onClick={handleParse}>Load from pasted CSS</button>
      <p className={`msg${isError ? ' error' : ''}`}>{msg}</p>
    </div>
  );
}
