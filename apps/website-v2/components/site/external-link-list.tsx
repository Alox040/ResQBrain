import { linksContent } from "@/lib/site";

export function ExternalLinkList() {
  return (
    <ul>
      {linksContent.items.map((item) => (
        <li key={item.label}>{item.label}</li>
      ))}
    </ul>
  );
}
