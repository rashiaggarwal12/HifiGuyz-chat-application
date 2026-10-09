const DiffText = ({ parts }) =>
  parts.map((part, i) =>
    part.type === "removed" ? (
      <del key={i} className="rounded bg-error/15 px-0.5 text-error/90 decoration-error/70">
        {part.text}
      </del>
    ) : part.type === "added" ? (
      <ins key={i} className="rounded bg-success/15 px-0.5 font-semibold text-success no-underline">
        {part.text}
      </ins>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
export default DiffText;
