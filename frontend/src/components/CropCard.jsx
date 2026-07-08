import { Droplets, Sprout, SunMedium } from "lucide-react";

function CropCard({ crop, actions }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-green-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
            Crop profile
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
            {crop.name}
          </h3>
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>

      <dl className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-start gap-3">
          <SunMedium className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
          <div>
            <dt className="font-medium text-slate-900 dark:text-slate-100">Season</dt>
            <dd>{crop.season}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Sprout className="mt-0.5 h-4 w-4 text-green-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-slate-900 dark:text-slate-100">Soil</dt>
            <dd>{crop.soil}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Droplets className="mt-0.5 h-4 w-4 text-teal-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-slate-900 dark:text-slate-100">
              Water requirement
            </dt>
            <dd>{crop.water}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}

export default CropCard;
