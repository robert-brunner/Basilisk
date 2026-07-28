import './LayerCard.css';

export default function LayerCard({ layer, index, onChange, onRemove }) {
  const set = (field, value) => onChange({ ...layer, [field]: value });

  return (
    <div className="layer-card">
      <div className="layer-title">
        <input
          type="text"
          className="layer-name"
          placeholder={`Layer ${index + 1}`}
          value={layer.name}
          onChange={e => set('name', e.target.value)}
        />
        <button
          className={`mirror-btn${layer.mirror ? ' active' : ''}`}
          title="Mirror this layer diagonally, live"
          onClick={() => onChange({ ...layer, mirror: !layer.mirror, uniform: false })}
        >
          {'<\u22EE>'}
        </button>
        <button
          className={`uniform-btn${layer.uniform ? ' active' : ''}`}
          title="Apply this layer uniformly on all four sides, live"
          onClick={() => onChange({ ...layer, uniform: !layer.uniform, mirror: false })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5 7h-9a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5m-9-1A1.5 1.5 0 0 0 6 7.5v9A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 16.5 6zm2.732 4.232a.5.5 0 1 0 .708.707.5.5 0 0 0-.708-.707m2.122 1.414a.5.5 0 1 0-.708.707.5.5 0 0 0 .707-.707m1.414 1.415a.5.5 0 1 0-.707.706.5.5 0 0 0 .707-.706M8.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0V9h1.5a.5.5 0 0 0 0-1zm7.5 5.5a.5.5 0 0 0-1 0V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5z"
            />
          </svg>
        </button>
        <button onClick={onRemove}>Remove</button>
      </div>

      <div className="row">
        <label>Inset</label>
        <input type="checkbox" checked={layer.inset} onChange={e => set('inset', e.target.checked)} />
      </div>

      <div className="row">
        <label>X offset</label>
        <input type="range" min="-40" max="40" value={layer.x} onChange={e => set('x', parseFloat(e.target.value))} />
        <span className="val">{layer.x}px</span>
      </div>

      <div className="row">
        <label>Y offset</label>
        <input type="range" min="-40" max="40" value={layer.y} onChange={e => set('y', parseFloat(e.target.value))} />
        <span className="val">{layer.y}px</span>
      </div>

      <div className="row">
        <label>Blur</label>
        <input type="range" min="0" max="80" step="0.1" value={layer.blur} onChange={e => set('blur', parseFloat(e.target.value))} />
        <span className="val">{layer.blur}px</span>
      </div>

      <div className="row">
        <label>Spread</label>
        <input type="range" min="-20" max="20" value={layer.spread} onChange={e => set('spread', parseFloat(e.target.value))} />
        <span className="val">{layer.spread}px</span>
      </div>

      <div className="row">
        <label>Color</label>
        <input type="color" value={layer.color} onChange={e => set('color', e.target.value)} />
        <span className="val">{layer.alpha}</span>
      </div>

      <div className="row">
        <label>Opacity</label>
        <input type="range" min="0" max="1" step="0.01" value={layer.alpha} onChange={e => set('alpha', parseFloat(e.target.value))} />
        <span className="val">{layer.alpha}</span>
      </div>
    </div>
  );
}
