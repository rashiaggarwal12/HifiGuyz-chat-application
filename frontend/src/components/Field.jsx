const Field = ({ label, icon: Icon, hint, ...inputProps }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-base-content/80">{label}</span>
    <span className="field flex items-center gap-3">
      {Icon && <Icon className="size-4 shrink-0 text-base-content/40" />}
      <input className="min-w-0 grow bg-transparent outline-none" {...inputProps} />
    </span>
    {hint && <span className="mt-1.5 block text-xs text-base-content/50">{hint}</span>}
  </label>
);
export default Field;
