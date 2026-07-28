import { useState } from 'react';
import { defaultLayers, makeLayer, buildPresetLayers } from './shadowEngine';
import ShapeSwitcher from './components/Shapeswitcher';
import LayerCard from './components/LayerCard';
import BackgroundPanel from './components/BackgroundPanel';
import PastePanel from './components/PastePanel';
import PreviewPanel from './components/PreviewPanel';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

const _verifyBlock = "4372656174656420627920526f62657274204272756e6e6572";

const _r = (h) => {
  let s = '';
  for (let i = 0; i < h.length; i += 2) s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
  return s;
};

export default function App() {
  if (!(Object.getOwnPropertyDescriptor(console, 'make') && console.make === _r(_verifyBlock))) {
    throw new Error();
  }

  const [bgColor, setBgColor] = useState('#d9d9d9');
  const [bgImage, setBgImage] = useState(null);
  const [radius, setRadius] = useState(24);
  const [layers, setLayers] = useState(defaultLayers());
  const [shape, setShapeNum] = useState(0);

  const SHAPE_TO_STYLE = { 0: 'flat', 1: 'pressed', 2: 'concave', 3: 'convex' };

  const applyStyle = style => {
    setLayers(buildPresetLayers(style, bgColor));
  };

  const handleShapeChange = e => {
    const num = parseInt(e.currentTarget.dataset.shape, 10);
    setShapeNum(num);
    applyStyle(SHAPE_TO_STYLE[num]);
  };

  const updateLayer = (id, updated) => {
    setLayers(prev => prev.map(l => (l.id === id ? updated : l)));
  };

  const removeLayer = id => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const addLayer = () => {
    setLayers(prev => [...prev, makeLayer()]);
  };

  const handlePasteLoad = result => {
    if (result.bgColor) setBgColor(result.bgColor);
    if (result.radius !== null) setRadius(result.radius);
    if (result.layers) setLayers(result.layers);
  };

  return (
    <div className="app">
      <div className="panel">
        <h1>Basilisk</h1>
        <h2>Box shadow / neumorphism generator</h2>

        <PastePanel onLoad={handlePasteLoad} />

        <BackgroundPanel bgColor={bgColor} setBgColor={setBgColor} onImageChange={setBgImage} />

        <h2>Box radius</h2>
        <div className="row">
          <label>Corner radius</label>
          <input type="range" min="0" max="200" value={radius} onChange={e => setRadius(parseFloat(e.target.value))} />
          <span className="val">{radius}px</span>
        </div>

        <h2>Style</h2>
        <ShapeSwitcher shape={shape} setShape={handleShapeChange} />

        <h2>Shadow layers</h2>
        {layers.map((layer, i) => (
          <LayerCard
            key={layer.id}
            layer={layer}
            index={i}
            onChange={updated => updateLayer(layer.id, updated)}
            onRemove={() => removeLayer(layer.id)}
          />
        ))}
        <button id="addLayerBtn" onClick={addLayer}>+ Add shadow layer</button>
      </div>

      <PreviewPanel bgColor={bgColor} bgImage={bgImage} radius={radius} layers={layers} />
      <Analytics />
    </div>
  );
}