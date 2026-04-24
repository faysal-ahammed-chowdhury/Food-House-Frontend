export default function TableHeader({ allHeader }: { allHeader: string[] }) {
  return allHeader.map((header) => {
    return (
      <th
        key={header}
        className="px-6 py-4 text-[13px] font-bold uppercase text-slate-400"
      >
        {header}
      </th>
    );
  });
}
