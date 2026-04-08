import type { ReactNode } from "react";

type Metric = {
  label: string;
  value: string;
};

type PanelStat = {
  label: string;
  value: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  metrics?: readonly Metric[];
  actions?: ReactNode;
  panelTitle: string;
  panelStats: readonly PanelStat[];
  aside?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  text,
  metrics,
  actions,
  panelTitle,
  panelStats,
  aside,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__grid">
        <div className="page-hero__main">
          <p className="page-hero__eyebrow">{eyebrow}</p>
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__text">{text}</p>
          {actions ? <div className="page-hero__actions">{actions}</div> : null}
          {metrics ? (
            <div className="page-hero__metrics">
              {metrics.map((metric) => (
                <div className="page-hero__metric" key={metric.label}>
                  <span className="page-hero__metric-label">{metric.label}</span>
                  <strong className="page-hero__metric-value">{metric.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="page-hero__panel" aria-label={panelTitle}>
          <p className="page-hero__panel-title">{panelTitle}</p>
          <div className="page-hero__panel-list">
            {panelStats.map((stat) => (
              <div className="page-hero__panel-item" key={stat.label}>
                <strong className="page-hero__panel-value">{stat.value}</strong>
                <span className="page-hero__panel-label">{stat.label}</span>
              </div>
            ))}
          </div>
          {aside}
        </aside>
      </div>
    </section>
  );
}
