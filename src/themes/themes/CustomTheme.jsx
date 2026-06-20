export default function CustomTheme({ bgUrl }) {
  if (!bgUrl) return <div className="fixed inset-0 z-0 bg-slate-900 pointer-events-none" />;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <img src={bgUrl} className="w-full h-full object-cover" alt="" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
