import {
  BarChart3,
  Droplets,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Sprout,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import CropCard from "../components/CropCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WeatherWidget from "../components/WeatherWidget";
import { Button, EmptyState, Input, Loader, Modal, Toast } from "../components/ui";
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
          <div key={field} className="grid gap-2">
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
              required
            />
            {errors[field] ? (
              <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">
                {errors[field]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-fit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </article>
  );
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
        icon: Sprout,
        label: "Crop records",
        value: crops.length,
        detail: "Returned by the existing crop API.",
      },
      {
        icon: BarChart3,
        label: "Seasons",
        value: uniqueSeasons.size,
        detail: "Derived from current crop response data.",
      },
      {
        icon: Droplets,
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

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
                  Operations dashboard
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
                  Crop management
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Manage crop records through the existing backend API. Search,
                  create, update, and delete actions use the current Express
                  routes without changing methods or response structures.
                </p>
              </div>
              <div className="break-words rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
                API chain: `/api/crops` to React state to UI
              </div>
            </div>
          </div>

          <WeatherWidget />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="mb-5 flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-700" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
                  Add crop
                </h2>
              </div>
              <CropForm
                form={createForm}
                setForm={setCreateForm}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting && !editCrop}
                submitLabel="Create crop"
                errors={createErrors}
              />
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
                    Search and filter
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Search calls the existing backend search endpoint.
                  </p>
                </div>
                <form className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto" onSubmit={handleSearch}>
                  <Input
                    id="crop-search"
                    label="Search crops"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full sm:w-64"
                  />
                  <Button type="submit" isLoading={isSearching} className="w-full sm:w-fit sm:self-end" disabled={isSearching}>
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Search
                  </Button>
                </form>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                Season filter
                <select
                  value={seasonFilter}
                  onChange={(event) => setSeasonFilter(event.target.value)}
                  className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="all">All seasons</option>
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          </div>

          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">
                  Crop records
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Showing {visibleCrops.length} record{visibleCrops.length === 1 ? "" : "s"} from
                  the current backend response.
                </p>
              </div>
            </div>

            {toast ? (
              <div className="mb-4">
                <Toast message={toast.message} tone={toast.tone} />
              </div>
            ) : null}

            {isLoading && <Loader text="Loading dashboard data..." />}

            {!isLoading && error && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}

            {!isLoading && !error && visibleCrops.length === 0 && (
              <EmptyState
                title={hasActiveFilters ? "No search results" : "No crops available"}
                message={
                  hasActiveFilters
                    ? "No crop records match your current search or season filter. Try clearing the search or selecting all seasons."
                    : "Create your first crop record with the form above. It will be saved to your authenticated account."
                }
                action={
                  hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                      isLoading={isSearching}
                    >
                      Clear filters
                    </Button>
                  ) : null
                }
              />
            )}

            {!isLoading && !error && visibleCrops.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleCrops.map((crop) => {
                  const id = getCropId(crop);
                  return (
                    <CropCard
                      key={id || crop.name}
                      crop={crop}
                      actions={
                        <>
                          <Button
                            variant="outline"
                            className="h-9 min-h-9 px-3"
                            onClick={() => openEdit(crop)}
                            disabled={Boolean(isDeletingId)}
                            aria-label={`Edit ${crop.name}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="danger"
                            className="h-9 min-h-9 px-3"
                            onClick={() => requestDelete(crop)}
                            isLoading={isDeletingId === id}
                            disabled={Boolean(isDeletingId)}
                            aria-label={`Delete ${crop.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </>
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>
        </section>
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
        <div className="grid gap-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteCropTarget?.name || "this crop"}</span>?
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteCropTarget(null)}
              disabled={Boolean(isDeletingId)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={confirmDelete}
              isLoading={Boolean(isDeletingId)}
            >
              Delete crop
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}

export default Dashboard;
