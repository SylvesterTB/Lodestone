export default function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9.5" stroke="#e0b050" strokeWidth="1" />
      <circle cx="12" cy="12" r="2.5" fill="#e0b050" />
      <line x1="12"  y1="2.5"  x2="12"  y2="7"    stroke="#e0b050" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12"  y1="17"   x2="12"  y2="21.5"  stroke="#e0b050" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2.5" y1="12"   x2="7"   y2="12"    stroke="#e0b050" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17"  y1="12"   x2="21.5" y2="12"   stroke="#e0b050" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5.6"  y1="5.6"  x2="8.4"  y2="8.4"  stroke="#e0b050" strokeWidth=".75" strokeLinecap="round" opacity=".5" />
      <line x1="15.6" y1="15.6" x2="18.4" y2="18.4" stroke="#e0b050" strokeWidth=".75" strokeLinecap="round" opacity=".5" />
      <line x1="18.4" y1="5.6"  x2="15.6" y2="8.4"  stroke="#e0b050" strokeWidth=".75" strokeLinecap="round" opacity=".5" />
      <line x1="8.4"  y1="15.6" x2="5.6"  y2="18.4" stroke="#e0b050" strokeWidth=".75" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}