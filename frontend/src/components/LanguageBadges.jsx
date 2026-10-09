import { LANGUAGE_TO_FLAG } from "../constants";
import { capitialize } from "../lib/utils";

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 rounded-[2px] inline-block"
      />
    );
  }
  return null;
}

const LanguageBadges = ({ native, learning }) => (
  <div className="flex flex-wrap gap-2 text-xs">
    {native && (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-violet-200 ring-1 ring-primary/30">
        {getLanguageFlag(native)}
        <span className="text-violet-200/60">Speaks</span>
        {capitialize(native)}
      </span>
    )}
    {learning && (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-cyan-200 ring-1 ring-accent/25">
        {getLanguageFlag(learning)}
        <span className="text-cyan-200/60">Learning</span>
        {capitialize(learning)}
      </span>
    )}
  </div>
);
export default LanguageBadges;
