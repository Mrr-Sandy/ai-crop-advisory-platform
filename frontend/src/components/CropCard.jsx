import { titleCase } from "../lib/crops";

// A crop record on its own: the crop, then the three facts advice depends on.
function CropCard({ crop, actions, footer, className = "" }) {
  return (
    <article className={`panel p-6 ${className}`}>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
        <h3 className="min-w-0 text-2xl">{titleCase(crop.name)}</h3>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
      <dl className="m-0 grid grid-cols-3 gap-4 pt-4 text-sm">
        <div>
          <dt className="text-muted">Season</dt>
          <dd className="m-0 mt-1 font-medium text-ink">{titleCase(crop.season)}</dd>
        </div>
        <div>
          <dt className="text-muted">Soil</dt>
          <dd className="m-0 mt-1 font-medium text-ink">{titleCase(crop.soil)}</dd>
        </div>
        <div>
          <dt className="text-muted">Water</dt>
          <dd className="m-0 mt-1 font-medium text-ink">{titleCase(crop.water)}</dd>
        </div>
      </dl>
      {footer}
    </article>
  );
}

export default CropCard;
