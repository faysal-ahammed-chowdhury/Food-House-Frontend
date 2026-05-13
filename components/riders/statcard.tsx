export default function Statcard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center">
      <div className="text-5xl font-black text-slate-800 mb-3 tracking-tighter">{value}</div>
      <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.15em]">{label}</div>
    </div>
  );
}