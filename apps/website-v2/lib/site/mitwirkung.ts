export const mitwirkungContent = {
  title: "Mitwirkung",
  intro: "Unterstuetzung ist in verschiedenen Formen moeglich.",
  sections: [
    {
      title: "Rueckmeldung",
      text: "Fachliche Hinweise helfen bei der inhaltlichen Schaerfung.",
    },
  ],
} as const;

export type MitwirkungContent = typeof mitwirkungContent;
