import * as THREE from 'three';

export type FinishId = 'obsidian' | 'titanium' | 'cinnabar';

export interface FinishPreset {
  id: FinishId;
  label: string;
  swatch: string;
  coreColor: number;
  coreRoughness: number;
  coreMetalness: number;
  ringColor: number;
  ringRoughness: number;
  ringMetalness: number;
  accentColor: number;
  nodeColor: number;
  nodeRoughness: number;
  nodeMetalness: number;
}

export const FINISH_PRESETS: Record<FinishId, FinishPreset> = {
  obsidian: {
    id: 'obsidian',
    label: 'Obsidian',
    swatch: '#18181B',
    coreColor: 0x18181b,
    coreRoughness: 0.18,
    coreMetalness: 0.88,
    ringColor: 0x3f3f46,
    ringRoughness: 0.36,
    ringMetalness: 0.72,
    accentColor: 0xe11d48,
    nodeColor: 0x27272a,
    nodeRoughness: 0.28,
    nodeMetalness: 0.8,
  },
  titanium: {
    id: 'titanium',
    label: 'Titanium',
    swatch: '#94A3B8',
    coreColor: 0xcbd5e1,
    coreRoughness: 0.22,
    coreMetalness: 0.94,
    ringColor: 0x64748b,
    ringRoughness: 0.44,
    ringMetalness: 0.65,
    accentColor: 0x2563eb,
    nodeColor: 0xe2e8f0,
    nodeRoughness: 0.24,
    nodeMetalness: 0.85,
  },
  cinnabar: {
    id: 'cinnabar',
    label: 'Cinnabar',
    swatch: '#E11D48',
    coreColor: 0xbe123c,
    coreRoughness: 0.2,
    coreMetalness: 0.85,
    ringColor: 0x27272a,
    ringRoughness: 0.42,
    ringMetalness: 0.7,
    accentColor: 0xf43f5e,
    nodeColor: 0xf4f4f5,
    nodeRoughness: 0.26,
    nodeMetalness: 0.75,
  },
};

export function createDialPlinthTexture(
  maxAnisotropy: number,
  darkTheme: boolean
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    ctx.clearRect(0, 0, size, size);

    const strokePrimary = darkTheme ? 'rgba(244, 244, 245, 0.34)' : 'rgba(24, 24, 27, 0.34)';
    const strokeSecondary = darkTheme ? 'rgba(244, 244, 245, 0.14)' : 'rgba(24, 24, 27, 0.14)';
    const accent = '#E11D48';

    // Outer calibrated rings
    [470, 420, 340, 220].forEach((radius, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = idx % 2 === 0 ? strokePrimary : strokeSecondary;
      ctx.lineWidth = idx === 0 ? 2.5 : 1.25;
      ctx.stroke();
    });

    // Degree tick marks
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 45 === 0;
      const isMid = deg % 15 === 0;
      const rOuter = 470;
      const rInner = isMajor ? 435 : isMid ? 448 : 458;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * rInner, cy + Math.sin(rad) * rInner);
      ctx.lineTo(cx + Math.cos(rad) * rOuter, cy + Math.sin(rad) * rOuter);
      ctx.strokeStyle = isMajor ? accent : strokePrimary;
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.stroke();
    }

    // Subtle crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - 480, cy);
    ctx.lineTo(cx - 240, cy);
    ctx.moveTo(cx + 240, cy);
    ctx.lineTo(cx + 480, cy);
    ctx.moveTo(cx, cy - 480);
    ctx.lineTo(cx, cy - 240);
    ctx.moveTo(cx, cy + 240);
    ctx.lineTo(cx, cy + 480);
    ctx.strokeStyle = strokeSecondary;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(maxAnisotropy, 8);
  texture.needsUpdate = true;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size / 2;
    const gradient = ctx.createRadialGradient(cx, cx, 10, cx, cx, cx);
    gradient.addColorStop(0, 'rgba(9, 9, 11, 0.42)');
    gradient.addColorStop(0.45, 'rgba(9, 9, 11, 0.16)');
    gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createBeveledLugGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.14, -0.08);
  shape.lineTo(0.14, -0.08);
  shape.lineTo(0.18, 0.0);
  shape.lineTo(0.14, 0.08);
  shape.lineTo(-0.14, 0.08);
  shape.lineTo(-0.18, 0.0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

export function createSkillPrismGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const radius = 0.24;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}
