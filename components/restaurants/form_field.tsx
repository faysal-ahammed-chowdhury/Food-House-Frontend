import { AlertCircle } from "lucide-react";

export const FormField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      {Icon && <Icon size={16} className={error ? "text-red-500" : "text-slate-400"} />}
      {label}
    </label>

    {props.type === "textarea" ? (
      <textarea
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-slate-700 transition-all outline-none resize-none ${
          error
            ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
            : "border-slate-200 focus:ring-4 focus:ring-pink-500/10 focus:border-[#f82c77]"
        }`}
      />
    ) : (
      <input
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-slate-700 transition-all outline-none ${
          error
            ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
            : "border-slate-200 focus:ring-4 focus:ring-pink-500/10 focus:border-[#f82c77]"
        }`}
      />
    )}

    {error && (
      <p className="text-red-600 text-xs flex items-center gap-1 mt-1 font-medium">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);