import { linksContent } from "@/lib/site";

export function ExternalLinkList() {
  return (
    <ul>
      {linksContent.items.map((item) => (
        <li key={item.label}>
          <a href={item.href}>{item.label}</a>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
