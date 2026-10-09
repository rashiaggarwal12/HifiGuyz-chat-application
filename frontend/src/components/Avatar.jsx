import { useState } from "react";

const fallbackFor = (name) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name || "?"
  )}&backgroundColor=a855f7,ec4899`;

// Shows the user's picture, falling back to initials if the image is missing or fails to load
const Avatar = ({ src, name, size = "size-10", ring = false, online = false }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const url = src && src !== failedSrc ? src : fallbackFor(name);

  return (
    <span className={`relative inline-block shrink-0 ${size}`}>
      <span
        className={`block size-full rounded-full overflow-hidden bg-base-300 ${
          ring ? "p-[2px] bg-brand" : ""
        }`}
      >
        <img
          src={url}
          alt={name || "User avatar"}
          onError={() => setFailedSrc(src)}
          className="size-full rounded-full object-cover bg-base-300"
        />
      </span>
      {online && (
        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-200" />
      )}
    </span>
  );
};
export default Avatar;
