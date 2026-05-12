export default function FormField({ label, icon: Icon, error, disabled,...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          {...props} 
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed border-slate-200 text-gray-500' 
              : error 
                ? 'bg-white border-red-500 ring-1 ring-red-50' 
                : 'bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
            }`}
        />
      </div>
      {disabled && (
        <p className="text-xs text-gray-400 ml-1">This field cannot be changed</p>
      )}
      
      {error && <p className="text-xs font-medium text-red-500 ml-1 mt-1">{error}</p>}
    </div>
  );
}
