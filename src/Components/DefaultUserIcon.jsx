import { useMemo } from "react";
import { minidenticon } from "minidenticons";

export default function DefaultUserIcon({ username, ...props }) {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," + encodeURIComponent(minidenticon(username)),
    [username]
  );
  return <img src={svgURI} alt={username} {...props} />;
}
