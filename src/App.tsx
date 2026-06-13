import { useState } from 'react';
import CropStep from './components/CropStep';
import DesignStep from './components/DesignStep';
import type { CropResult } from './types';

function App() {
  const [crop, setCrop] = useState<CropResult | null>(null);

  return crop ? (
    <DesignStep crop={crop} onStartOver={() => setCrop(null)} />
  ) : (
    <CropStep onCropApplied={setCrop} />
  );
}

export default App;
