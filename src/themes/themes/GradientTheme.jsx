export default function GradientTheme() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #ecfdf5, #eff6ff, #fdf4ff)' }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full -translate-y-1/3 translate-x-1/3"
        style={{ background: 'radial-gradient(circle, #6ee7b7, transparent 70%)', opacity: 0.35, filter: 'blur(80px)', animation: 'grd-float1 12s ease-in-out infinite alternate' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full translate-y-1/3 -translate-x-1/3"
        style={{ background: 'radial-gradient(circle, #93c5fd, transparent 70%)', opacity: 0.35, filter: 'blur(80px)', animation: 'grd-float2 14s ease-in-out infinite alternate' }} />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #d8b4fe, transparent 70%)', opacity: 0.2, filter: 'blur(80px)', animation: 'grd-float3 10s ease-in-out infinite alternate' }} />
      <style>{`
        @keyframes grd-float1 { 0%{transform:translateY(-33%) translateX(33%) scale(1)} 100%{transform:translateY(-28%) translateX(38%) scale(1.1)} }
        @keyframes grd-float2 { 0%{transform:translateY(33%) translateX(-33%) scale(1)} 100%{transform:translateY(28%) translateX(-38%) scale(1.08)} }
        @keyframes grd-float3 { 0%{transform:translateX(-50%) translateY(-50%) scale(1)} 100%{transform:translateX(-50%) translateY(-55%) scale(1.12)} }
      `}</style>
    </div>
  );
}
