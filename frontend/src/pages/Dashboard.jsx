import { Pencil, Plus, Search, ShieldAlert, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import AppShell from "../components/AppShell";
import WeatherWidget from "../components/WeatherWidget";
import { Button, EmptyState, Input, Loader, Modal, Toast } from "../components/ui";
import { getProfile } from "../api/auth";
import { askLink, countBy, distinctCrops, questionFor, shortQuestion, titleCase } from "../lib/crops";
import { MONTH, YEAR, seasonOf, today } from "../lib/seasons";
import {
  createCrop,
  deleteCrop,
  getCrops,
  searchCrops,
  updateCrop,
} from "../api/crops";

const emptyForm = {
  name: "",
  season: "",
  soil: "",
  water: "",
};

function getCropId(crop) {
  return crop._id || crop.id;
}

function normalizeForm(form) {
  return {
    name: form.name.trim(),
    season: form.season.trim(),
    soil: form.soil.trim(),
    water: form.water.trim(),
  };
}

function validateCropForm(form) {
  const fields = {
    name: "Crop name",
    season: "Season",
    soil: "Soil type",
    water: "Water requirement",
  };
  const errors = {};

  Object.entries(fields).forEach(([field, label]) => {
    if (!form[field].trim()) {
      errors[field] = `${label} is required.`;
    }
  });

  return errors;
}

function CropForm({ form, setForm, onSubmit, isSubmitting, submitLabel, errors = {} }) {
  const fields = [
    ["name", "Crop name", "Rice"],
    ["season", "Season", "Kharif"],
    ["soil", "Soil type", "Clay loam"],
    ["water", "Water requirement", "High"],
  ];

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([field, label, placeholder]) => (
          <div key={field} className="grid gap-1">
            <Input
              id={`crop-${field}`}
              label={label}
              placeholder={placeholder}
              value={form[field]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
              disabled={isSubmitting}
              density="app"
              required
            />
            {errors[field] ? (
              <p className="field__note field__note--error" role="alert">
                {errors[field]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <Button type="submit" variant="outline" size="app" isLoading={isSubmitting} className="w-full sm:w-fit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createErrors, setCreateErrors] = useState({});
  const [editCrop, setEditCrop] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editErrors, setEditErrors] = useState({});
  const [deleteCropTarget, setDeleteCropTarget] = useState(null);
  const [profile, setProfile] = useState(null);
  const calRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getProfile({ signal: controller.signal })
      .then(setProfile)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const loadCrops = useCallback(async ({ query = "", signal } = {}) => {
    const trimmedQuery = query.trim();
    const data = trimmedQuery
      ? await searchCrops(trimmedQuery, { signal })
      : await getCrops({ signal });
    setCrops(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError("");
        await loadCrops({ query: "", signal: controller.signal });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load crops from the backend.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => controller.abort();
  }, [loadCrops]);

  const seasons = useMemo(() => {
    return Array.from(new Set(crops.map((crop) => crop.season).filter(Boolean))).sort();
  }, [crops]);

  const visibleCrops = useMemo(() => {
    if (seasonFilter === "all") {
      return crops;
    }

    return crops.filter((crop) => crop.season === seasonFilter);
  }, [crops, seasonFilter]);

  const stats = useMemo(() => {
    const uniqueSeasons = new Set(crops.map((crop) => crop.season).filter(Boolean));
    const uniqueSoils = new Set(crops.map((crop) => crop.soil).filter(Boolean));
    const waterTypes = new Set(crops.map((crop) => crop.water).filter(Boolean));

    return [
      {
        label: "Crop records",
        value: crops.length,
        detail: "Saved to your account.",
      },
      {
        label: "Seasons",
        value: uniqueSeasons.size,
        detail: "Counted from your records.",
      },
      {
        label: "Water profiles",
        value: waterTypes.size,
        detail: `${uniqueSoils.size} soil profiles are represented.`,
      },
    ];
  }, [crops]);

  const hasActiveFilters = Boolean(searchTerm.trim()) || seasonFilter !== "all";

  async function handleSearch(event) {
    event.preventDefault();

    try {
      setIsSearching(true);
      setError("");
      setSeasonFilter("all");
      await loadCrops({ query: searchTerm });
    } catch {
      setError("Search failed. Please confirm the backend is running.");
    } finally {
      setIsSearching(false);
    }
  }

  async function clearFilters() {
    try {
      setIsSearching(true);
      setError("");
      setSearchTerm("");
      setSeasonFilter("all");
      await loadCrops({ query: "" });
    } catch {
      setError("Unable to reload crops. Please confirm the backend is running.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    const validationErrors = validateCropForm(createForm);

    if (Object.keys(validationErrors).length > 0) {
      setCreateErrors(validationErrors);
      setToast({ message: "Please complete all crop fields before creating a record.", tone: "error" });
      return;
    }

    const payload = normalizeForm(createForm);

    try {
      setIsSubmitting(true);
      setError("");
      setCreateErrors({});
      await createCrop(payload);
      setCreateForm(emptyForm);
      setSearchTerm("");
      setSeasonFilter("all");
      await loadCrops({ query: "" });
      setToast({ message: "Crop created successfully.", tone: "success" });
    } catch (err) {
      setToast({ message: err.message || "Unable to create crop.", tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(crop) {
    setEditCrop(crop);
    setEditErrors({});
    setEditForm({
      name: crop.name || "",
      season: crop.season || "",
      soil: crop.soil || "",
      water: crop.water || "",
    });
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const id = getCropId(editCrop);
    const validationErrors = validateCropForm(editForm);

    if (!id) {
      setToast({ message: "Unable to update this crop because its record id is missing.", tone: "error" });
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      setToast({ message: "Please complete all crop fields before saving changes.", tone: "error" });
      return;
    }

    const payload = normalizeForm(editForm);

    try {
      setIsSubmitting(true);
      setError("");
      setEditErrors({});
      await updateCrop(id, payload);
      setEditCrop(null);
      await loadCrops({ query: searchTerm });
      setToast({ message: "Crop updated successfully.", tone: "success" });
    } catch (err) {
      setToast({ message: err.message || "Unable to update crop.", tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestDelete(crop) {
    setDeleteCropTarget(crop);
  }

  async function confirmDelete() {
    const id = getCropId(deleteCropTarget);

    if (!id) {
      setToast({ message: "Unable to delete this crop because its record id is missing.", tone: "error" });
      return;
    }

    try {
      setIsDeletingId(id);
      setError("");
      await deleteCrop(id);
      setCrops((current) => current.filter((item) => getCropId(item) !== id));
      setDeleteCropTarget(null);
      setToast({ message: "Crop deleted successfully.", tone: "success" });
    } catch (err) {
      setToast({ message: err.message || "Unable to delete crop.", tone: "error" });
    } finally {
      setIsDeletingId("");
    }
  }

  useEffect(() => {
    const box = calRef.current;
    const cell = box?.querySelector("thead .is-now");
    if (box && cell && box.scrollWidth > box.clientWidth) {
      box.scrollLeft = Math.max(0, cell.offsetLeft - box.clientWidth / 2);
    }
  }, [crops]);

  const firstName = (profile?.name || "").trim().split(/\s+/)[0];
  const now = today();
  const unique = distinctCrops(crops);
  const soilGroups = countBy(unique, "soil");
  const waterLevels = countBy(unique, "water").map((g) => g.label);
  const advisorQuestions = unique.slice(0, 3).map((crop) => ({
    label: shortQuestion(crop),
    question: questionFor({ ...crop, name: titleCase(crop.name), season: titleCase(crop.season), soil: titleCase(crop.soil) }),
  }));
  const inSeasonNow = unique.filter((crop) => seasonOf(crop.season)?.key === now.season.key);

  return (
    <AppShell>
      <main className="appwrap">
        {/* Welcome */}
        <section className="grid gap-8 border-b border-ink pb-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-end">
          <div className="min-w-0">
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="mt-2 max-w-none text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.95]">
              {greeting()}
              {firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="serif mt-5 max-w-[46ch] text-[clamp(1.25rem,1.6vw,1.5rem)] leading-snug text-ink-2">
              {isLoading
                ? "Loading your crop records."
                : `${now.name}: ${now.line}. ${inSeasonNow.length ? `${inSeasonNow.length} of your crops ${inSeasonNow.length === 1 ? "is" : "are"} ${now.season.label}.` : `None of your crops are ${now.season.label} yet.`}`}
            </p>
          </div>
          <dl className="m-0 grid grid-cols-3 border-t border-rule xl:border-t-0">
            {[
              [stats[0].value, "crop records"],
              [stats[1].value, stats[1].value === 1 ? "season" : "seasons"],
              [soilGroups.length, soilGroups.length === 1 ? "soil type" : "soil types"],
            ].map(([value, label], index) => (
              <div key={label} className={`pt-4 xl:pt-0 ${index ? "border-l border-rule pl-5" : ""}`}>
                <dt className="sr-only">{label}</dt>
                <dd className="m-0">
                  <span className="tnum block font-display text-[3.25rem] leading-none text-ink">{value}</span>
                  <span className="text-sm text-muted">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <WeatherWidget />

        {/* The year in your fields + soil and water */}
        <div className="grid gap-12 border-b border-rule py-10 2xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <section className="min-w-0" aria-labelledby="year-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="year-title" className="text-3xl">The year in your fields</h2>
              <ul className="flex list-none flex-wrap gap-4 p-0 text-sm text-muted">
                {[["kharif", "Kharif"], ["rabi", "Rabi"], ["zaid", "Zaid"]].map(([key, label]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="swatch" style={{ background: `var(--color-${key})` }} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div ref={calRef} className="mt-6 overflow-x-auto">
              <table className="yearcal min-w-[44rem]">
                <caption className="sr-only">Each crop record laid across the months of its typical season</caption>
                <thead>
                  <tr>
                    <th scope="col">Crop</th>
                    {YEAR.map((m) => (
                      <th key={m} scope="col" className={m === now.month ? "is-now" : ""}>
                        {MONTH[m]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unique.map((crop) => {
                    const season = seasonOf(crop.season);
                    return (
                      <tr key={getCropId(crop) || crop.name}>
                        <th scope="row">
                          {titleCase(crop.name)}
                          <small>{season ? season.label : `${titleCase(crop.season) || "No season"}, not a known season`}</small>
                        </th>
                        {YEAR.map((m) => {
                          const on = season && season.months.includes(m);
                          return (
                            <td key={m} className={m === now.month ? "is-now" : ""}>
                              <span className={on ? `on-${season.key}` : ""} />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">Typical windows; they shift by region and with the rains. The brass line is this month.</p>
          </section>

          <aside className="min-w-0" aria-labelledby="matrix-title">
            <h2 id="matrix-title" className="text-3xl">Soil and water</h2>
            <p className="mt-2 text-sm text-muted">Where each crop sits by the ground it grows in and the water it needs.</p>
            {soilGroups.length ? (
              <div className="mt-6 overflow-x-auto">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th scope="col">Soil</th>
                      {waterLevels.map((w) => (
                        <th key={w} scope="col">{w} water</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {soilGroups.map((soil) => (
                      <tr key={soil.label}>
                        <th scope="row">{soil.label}</th>
                        {waterLevels.map((w) => (
                          <td key={w}>
                            {soil.items
                              .filter((c) => titleCase(c.water) === w)
                              .map((c) => titleCase(c.name))
                              .join(", ")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">Add a crop record to see it here.</p>
            )}
          </aside>
        </div>

        <div className="grid gap-12 py-10 2xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] 2xl:gap-16">
          {/* Records */}
          <section className="min-w-0" aria-labelledby="crop-records-title">
            <div className="flex flex-col gap-4 pb-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <h2 id="crop-records-title" className="text-3xl">
                  Crop records
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Showing {visibleCrops.length} record{visibleCrops.length === 1 ? "" : "s"}.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="app"
                  onClick={() => {
                    document.getElementById("add-crop-title")?.scrollIntoView({ block: "start" });
                    document.getElementById("crop-name")?.focus({ preventScroll: true });
                  }}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add crop
                </Button>
                <form className="flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={handleSearch}>
                  <Input
                    id="crop-search"
                    label="Search crops"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    density="app"
                    className="w-full sm:w-48"
                  />
                  <Button type="submit" variant="outline" size="app" isLoading={isSearching} disabled={isSearching}>
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Search
                  </Button>
                </form>

                <label className="field field--app">
                  <span className="field__label">Season filter</span>
                  <select
                    value={seasonFilter}
                    onChange={(event) => setSeasonFilter(event.target.value)}
                    className="field__input sm:w-40"
                  >
                    <option value="all">All seasons</option>
                    {seasons.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {toast ? (
              <div className="mt-4">
                <Toast message={toast.message} tone={toast.tone} />
              </div>
            ) : null}

            {isLoading && <Loader text="Loading dashboard data..." />}

            {!isLoading && error && (
              <div className="mt-4 rounded-card bg-error-soft p-5 text-sm font-medium text-ink" role="alert">
                {error}
              </div>
            )}

            {!isLoading && !error && visibleCrops.length === 0 && (
              <EmptyState
                title={hasActiveFilters ? "No search results" : "No crops available"}
                message={
                  hasActiveFilters
                    ? "No crop records match your current search or season filter. Try clearing the search or selecting all seasons."
                    : "Create your first crop record with the form beside the records. It will be saved to your authenticated account."
                }
                action={
                  hasActiveFilters ? (
                    <Button type="button" variant="outline" size="app" onClick={clearFilters} isLoading={isSearching}>
                      Clear filters
                    </Button>
                  ) : null
                }
              />
            )}

            {!isLoading && !error && visibleCrops.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="ledger ledger--stack">
                  <thead>
                    <tr>
                      <th scope="col">Crop</th>
                      <th scope="col">Season</th>
                      <th scope="col">Soil</th>
                      <th scope="col">Water requirement</th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCrops.map((crop) => {
                      const id = getCropId(crop);
                      const season = seasonOf(crop.season);
                      return (
                        <tr key={id || crop.name}>
                          <th scope="row">{titleCase(crop.name)}</th>
                          <td data-label="Season">
                            <span className="inline-flex items-center gap-2">
                              {season ? <span className="swatch" style={{ background: `var(--color-${season.key})` }} aria-hidden="true" /> : null}
                              {titleCase(crop.season)}
                            </span>
                          </td>
                          <td data-label="Soil">{titleCase(crop.soil)}</td>
                          <td data-label="Water requirement">{titleCase(crop.water)}</td>
                          <td className="col-span-2">
                            <div className="flex justify-end gap-2 max-sm:justify-start">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEdit(crop)}
                                disabled={Boolean(isDeletingId)}
                                aria-label={`Edit ${crop.name}`}
                              >
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-error"
                                onClick={() => requestDelete(crop)}
                                isLoading={isDeletingId === id}
                                disabled={Boolean(isDeletingId)}
                                aria-label={`Delete ${crop.name}`}
                              >
                                {isDeletingId === id ? null : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Side: ask and add */}
          <div className="grid content-start gap-12 xl:grid-cols-2 2xl:grid-cols-1">

            <section className="border-t border-ink pt-6" aria-labelledby="add-crop-title">
              <h2 id="add-crop-title" className="mb-5 scroll-mt-8 text-2xl">
                Add crop
              </h2>
              <CropForm
                form={createForm}
                setForm={setCreateForm}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting && !editCrop}
                submitLabel="Create crop"
                errors={createErrors}
              />
            </section>

            <section className="context-card" aria-labelledby="advisor-questions-title">
              <h2 id="advisor-questions-title" className="text-2xl">
                Ask the advisor
              </h2>
              <p className="mt-2 text-sm text-[var(--color-on-night-muted)]">Built from your records. Each opens the assistant with the question ready.</p>
              {advisorQuestions.length > 0 ? (
                <ul className="mt-4 list-none border-b border-[var(--color-night-rule)] p-0">
                  {advisorQuestions.map((item) => (
                    <li key={item.question}>
                      <Link to={askLink(item.question)} className="cropline">
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm">Add a crop record to get suggested questions.</p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Modal
        isOpen={Boolean(editCrop)}
        title={editCrop ? `Update ${editCrop.name}` : "Update crop"}
        onClose={() => setEditCrop(null)}
      >
        <CropForm
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting && Boolean(editCrop)}
          submitLabel="Save changes"
          errors={editErrors}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deleteCropTarget)}
        title="Delete crop record"
        onClose={() => setDeleteCropTarget(null)}
      >
        <div className="grid gap-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
            <p className="text-ink-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-ink">{deleteCropTarget?.name || "this crop"}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setDeleteCropTarget(null)} disabled={Boolean(isDeletingId)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmDelete} isLoading={Boolean(isDeletingId)}>
              Delete crop
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

export default Dashboard;
