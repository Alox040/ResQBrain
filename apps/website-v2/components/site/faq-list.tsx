import { homeContent } from "@/lib/site";

export function FaqList() {
  return (
    <ul>
      {homeContent.faq.map((item) => (
        <li key={item.question}>{item.question}</li>
      ))}
    </ul>
  );
}
