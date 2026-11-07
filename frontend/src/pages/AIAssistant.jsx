import { Check, Copy, RotateCcw, SendHorizonal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AppShell from "../components/AppShell";
import Consultation from "../components/Consultation";
import MonthBand from "../components/MonthBand";
import { Button, EmptyState, Loader, Toast } from "../components/ui";
import { sendAiQuestion } from "../api/ai";
import { getCrops } from "../api/crops";
import { distinctCrops, questionFor, titleCase } from "../lib/crops";
import { seasonOf, today } from "../lib/seasons";

function display(crop) {
  return { ...crop, name: titleCase(crop.name), season: titleCase(crop.season), soil: titleCase(crop.soil), water: titleCase(crop.water) };
}

function followUps(crop) {
  const soil = crop.soil.toLowerCase();
  return [
    questionFor(crop),
    `How much water does ${crop.name} need in ${soil} soil, and how often should I irrigate?`,
    `What pests and diseases should I watch for in ${crop.name} during ${crop.season}?`,
    `How should I prepare ${soil} soil before sowing ${crop.name}?`,
  ];
}

function findCrop(text, crops) {
  const lower = String(text || "").toLowerCase();
  return crops.find((crop) => crop.name && lower.includes(crop.name.toLowerCase())) || null;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="key key--ghost key--app"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

let nextId = 0;
const makeId = () => `m${(nextId += 1)}`;

function AIAssistant() {
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState(() => searchParams.get("q") || "");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [crops, setCrops] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionError, setSuggestionError] = useState("");
  const [focusId, setFocusId] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const now = today();

  const trimmedQuestion = question.trim();
  const canSubmit = useMemo(() => trimmedQuestion.length > 0 && !isLoading, [trimmedQuestion, isLoading]);
  const unique = useMemo(() => distinctCrops(crops).map(display), [crops]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSuggestedQuestions() {
      try {
        setIsLoadingSuggestions(true);
        setSuggestionError("");
        const data = await getCrops({ signal: controller.signal });
        setCrops(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestionError("Unable to load crop-based suggestions.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }

    loadSuggestedQuestions();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!messages.length && !isLoading) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, isLoading]);

  // The crop in context: the one picked, else the one the latest question names, else the draft's.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const context =
    unique.find((c) => (c._id || c.id || c.name) === focusId) ||
    findCrop(lastUser?.text, unique) ||
    findCrop(question, unique) ||
    null;
  const contextSeason = context ? seasonOf(context.season) : null;

  async function ask(text) {
    const asked = text.trim();

    if (!asked) {
      setError("Please enter a farming question.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessages((current) => [...current, { id: makeId(), role: "user", text: asked }]);
      setQuestion("");

      const data = await sendAiQuestion(asked);
      setMessages((current) => [
        ...current,
        { id: makeId(), role: "ai", text: data.reply || "No response was returned.", question: asked },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        { id: makeId(), role: "error", text: err.message || "Unable to get AI response.", question: asked },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    ask(question);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSubmit) ask(question);
    }
  }

  function pickSuggestion(text, crop) {
    setQuestion(text);
    if (crop) setFocusId(crop._id || crop.id || crop.name);
    inputRef.current?.focus();
  }

  return (
    <AppShell>
      <div className="console">
        <section className="console__thread" aria-labelledby="advisor-title">
          <div className="border-b border-ink pb-6">
            <p className="text-sm text-muted">Crop advisor</p>
            <h1 id="advisor-title" className="mt-1 max-w-[22ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02]">
              What is happening in your field?
            </h1>
            <p className="mt-3 max-w-[62ch] text-muted">
              Describe the crop, season, soil, symptoms or weather. Each answer comes in five parts: the likely cause, what
              to do now, what to watch for, when to call an expert, and a recommendation.
            </p>
          </div>

          {suggestionError ? (
            <div className="mt-4">
              <Toast message={suggestionError} tone="error" />
            </div>
          ) : null}

          <div className="grid flex-1 content-start gap-12 py-10" aria-live="polite">
            {messages.length === 0 && !isLoading ? (
              <div className="grid gap-4">
                <p className="text-sm font-medium text-ink-2">Start with one of your crops. Each opens a question you can edit.</p>
                {isLoadingSuggestions ? (
                  <Loader text="Loading crop-based suggestions..." />
                ) : unique.length > 0 ? (
                  <div className="border-b border-rule">
                    {unique.slice(0, 4).map((crop) => {
                      const season = seasonOf(crop.season);
                      return (
                        <button
                          key={crop._id || crop.id || crop.name}
                          type="button"
                          onClick={() => pickSuggestion(questionFor(crop), crop)}
                          className="ask-row grid gap-1 sm:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] sm:items-baseline sm:gap-6"
                          aria-label={questionFor(crop)}
                        >
                          <span className="font-display text-3xl">{crop.name}</span>
                          <span className="flex items-center gap-2 text-muted">
                            {season ? <span className="swatch" style={{ background: `var(--color-${season.key})` }} aria-hidden="true" /> : null}
                            {crop.season} season, {crop.soil.toLowerCase()} soil, {crop.water.toLowerCase()} water
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title="No crop prompts yet"
                    message="Add crop records in the dashboard to generate question ideas from your own data."
                    action={
                      <Link to="/dashboard" className="key key--ink key--app">
                        Add crop records
                      </Link>
                    }
                  />
                )}
              </div>
            ) : null}

            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div key={message.id} className="msg grid">
                    <p className="msg--user whitespace-pre-wrap">{message.text}</p>
                  </div>
                );
              }
              if (message.role === "ai") {
                const about = findCrop(message.question, unique);
                const aboutSeason = about ? seasonOf(about.season) : null;
                return (
                  <article key={message.id} className="msg msg--ai" aria-label="AI response">
                    <div className="answerhead">
                      <p className="font-display text-xl">Advisor</p>
                      {about ? (
                        <span className="ctxchip">
                          {aboutSeason ? <i style={{ background: `var(--color-${aboutSeason.key})` }} aria-hidden="true" /> : null}
                          {about.name}, {about.season}, {about.soil.toLowerCase()} soil
                        </span>
                      ) : null}
                      <span className="ml-auto">
                        <CopyButton text={message.text} />
                      </span>
                    </div>
                    <Consultation text={message.text} />
                  </article>
                );
              }
              return (
                <div key={message.id} className="msg msg--ai grid gap-3" role="alert">
                  <p className="rounded-card bg-error-soft px-4 py-3 text-sm font-medium text-ink">
                    The advisor could not answer: {message.text}
                  </p>
                  <div>
                    <Button variant="outline" size="app" onClick={() => ask(message.question)} disabled={isLoading}>
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Ask again
                    </Button>
                  </div>
                </div>
              );
            })}

            {isLoading ? (
              <div className="msg msg--ai grid gap-4" role="status">
                <p className="text-sm font-medium text-muted">Generating advisory response…</p>
                <div className="thinking" aria-hidden="true">
                  <span className="w-11/12" />
                  <span className="w-9/12" />
                  <span className="w-10/12" />
                  <span className="w-7/12" />
                  <span className="w-8/12" />
                </div>
              </div>
            ) : null}
            <div ref={endRef} className="scroll-mb-48" />
          </div>

          <form onSubmit={handleSubmit} className="composer">
            <label htmlFor="ai-question" className="sr-only">
              Farming question
            </label>
            <div className="composer__box">
              <textarea
                id="ai-question"
                ref={inputRef}
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="My tomato crop has yellow leaves in clay loam soil during the rains. What should I do first?"
                rows={2}
                disabled={isLoading}
                aria-describedby="ai-question-help"
                required
              />
              <Button type="submit" isLoading={isLoading} disabled={!canSubmit}>
                {!isLoading ? <SendHorizonal className="h-4 w-4" aria-hidden="true" /> : null}
                {isLoading ? "Generating advice" : "Get advice"}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-muted">
              <p id="ai-question-help" className="tnum">
                {trimmedQuestion.length} characters entered. Enter to send, Shift and Enter for a new line.
              </p>
              {error ? (
                <p className="font-medium text-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="console__aside" aria-labelledby="context-title">
          <h2 id="context-title" className="text-2xl">
            In context
          </h2>
          {context ? (
            <div className="context-card mt-5">
              <h3 className="text-3xl">{context.name}</h3>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <dt>Season</dt>
                  <dd>{context.season}</dd>
                </div>
                <div>
                  <dt>Soil</dt>
                  <dd>{context.soil}</dd>
                </div>
                <div>
                  <dt>Water</dt>
                  <dd>{context.water}</dd>
                </div>
              </dl>
              <MonthBand current={now.month} focus={contextSeason?.key} className="mt-5" />
              <p className="mt-3 text-sm text-[var(--color-on-night-muted)]">
                {contextSeason ? contextSeason.note : "This season is not one of Kharif, Rabi or Zaid."}
              </p>
            </div>
          ) : (
            <div className="context-card mt-5">
              <p className="text-sm text-[var(--color-on-night-muted)]">This month</p>
              <h3 className="mt-1 text-3xl">{now.season.label} season</h3>
              <p className="mt-2">{now.name}: {now.line}.</p>
              <MonthBand current={now.month} focus={now.season.key} className="mt-5" />
              <p className="mt-3 text-sm text-[var(--color-on-night-muted)]">{now.season.note}</p>
              <p className="mt-5 text-sm text-[var(--color-on-night-muted)]">Your {now.season.label} crops</p>
              {unique.filter((c) => seasonOf(c.season)?.key === now.season.key).length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {unique
                    .filter((c) => seasonOf(c.season)?.key === now.season.key)
                    .map((crop) => (
                      <button
                        key={crop._id || crop.id || crop.name}
                        type="button"
                        className="cropchip cropchip--night"
                        onClick={() => pickSuggestion(questionFor(crop), crop)}
                      >
                        {crop.name}, {crop.soil.toLowerCase()} soil
                      </button>
                    ))}
                </div>
              ) : (
                <p className="mt-2 text-sm">None yet.</p>
              )}
              <p className="mt-4 text-xs text-[var(--color-on-night-muted)]">Typical windows; they shift by region and with the rains.</p>
            </div>
          )}

          {context ? (
            <div className="mt-8">
              <p className="text-sm font-medium text-ink-2">Ask next about {context.name}</p>
              <div className="mt-2 border-b border-rule">
                {followUps(context).map((item) => (
                  <button key={item} type="button" className="ask-row text-sm" onClick={() => pickSuggestion(item, context)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.length > 0 || context ? (
          <div className="mt-8">
            <p className="text-sm font-medium text-ink-2">Your crops</p>
            {isLoadingSuggestions ? (
              <Loader text="Loading crops…" />
            ) : unique.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {unique.slice(0, 10).map((crop) => {
                  const id = crop._id || crop.id || crop.name;
                  return (
                    <button
                      key={id}
                      type="button"
                      className="cropchip"
                      aria-pressed={context ? (context._id || context.id || context.name) === id : false}
                      onClick={() => setFocusId(id)}
                    >
                      {crop.name}, {crop.season}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">No crop records yet.</p>
            )}
          </div>
          ) : null}
        </aside>
      </div>
    </AppShell>
  );
}

export default AIAssistant;
