import { useRef, useState } from 'react';
import { buildShadowCSS, buildFullCSS } from '../shadowEngine';

export default function PreviewPanel({ bgColor, bgImage, radius, layers }) {
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const shadowCSS = buildShadowCSS(layers);
  const fullCSS = buildFullCSS({ bgColor, radius, layers });

  const handleCopy = () => {
    outputRef.current.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="preview-wrap">
      <div
        className="bg-wrap"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundColor: bgImage ? undefined : '#111'
        }}
      >
        <div
          className="preview-box"
          style={{
            borderRadius: `${radius}px`,
            background: bgColor,
            boxShadow: shadowCSS
          }}
        />
      </div>

      <div className="output-block">
        <h2>Output CSS</h2>
        <textarea ref={outputRef} readOnly value={fullCSS} />
        <button onClick={handleCopy}>{copied ? 'Copied' : 'Copy CSS'}</button>
      </div>
    </div>
  );
}
