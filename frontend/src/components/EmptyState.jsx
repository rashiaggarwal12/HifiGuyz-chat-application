const EmptyState = ({ icon: Icon, title, children, action }) => (
  <div className="glass-panel rounded-2xl flex flex-col items-center justify-center px-6 py-14 text-center">
    {Icon && (
      <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/25">
        <Icon className="size-7 text-primary" />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold">{title}</h3>
    {children && <p className="mt-2 max-w-md text-sm text-base-content/60">{children}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
export default EmptyState;
