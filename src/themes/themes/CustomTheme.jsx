export default function CustomTheme({ bgUrl }) {
  if (!bgUrl) return <div className="fixed inset-0 z-0 bg-slate-900 pointer-events-none" />;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      {/* CSS background avoids per-scroll img repaints; translateZ promotes to its own GPU layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
