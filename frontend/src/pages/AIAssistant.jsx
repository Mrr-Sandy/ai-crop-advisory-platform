import { Sparkles, SendHorizonal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, Loader, Toast } from "../components/ui";
import { sendAiQuestion } from "../api/ai";
import { getCrops } from "../api/crops";

function buildSuggestedQuestions(crops) {
  return crops
    .filter((crop) => crop?.name)
    .slice(0, 3)
    .map((crop) => {
      const cropName = crop.name;
      const season = crop.season ? ` during ${crop.season} season` : "";
      const soil = crop.soil ? ` in ${crop.soil} soil` : "";
      return `What practical advice should I follow for ${cropName}${season}${soil}?`;
    });
}

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionError, setSuggestionError] = useState("");

  const canSubmit = useMemo(() => question.trim().length > 0 && !isLoading, [question, isLoading]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSuggestedQuestions() {
      try {
        setIsLoadingSuggestions(true);
        setSuggestionError("");
        const crops = await getCrops({ signal: controller.signal });
        setSuggestedQuestions(buildSuggestedQuestions(crops));
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a farming question.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setAnswer("");

      const data = await sendAiQuestion(question.trim());
      setAnswer(data.reply || "No response was returned.");
    } catch (err) {
      setError(err.message || "Unable to get AI response.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
                Week 7 AI integration
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                Ask for crop guidance in plain language.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Use the assistant to ask about irrigation, soil preparation,
                crop timing, pests, or practical field decisions.
              </p>

              <div className="mt-6 grid gap-3">
                {isLoadingSuggestions ? (
                  <Loader text="Loading crop-based suggestions..." />
                ) : suggestedQuestions.length > 0 ? (
                  suggestedQuestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuestion(item)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:border-green-300 hover:bg-green-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-green-800 dark:hover:bg-green-950"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    Add crop records to see AI question suggestions.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {suggestionError ? (
                <div className="mb-4">
                  <Toast message={suggestionError} tone="error" />
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <label htmlFor="ai-question" className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Your question
                </label>
                <textarea
                  id="ai-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a farming question..."
                  rows={6}
                  className="min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  disabled={isLoading}
                  required
                />

                {error ? (
                  <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" isLoading={isLoading} className="w-full sm:w-fit" disabled={!canSubmit}>
                  <SendHorizonal className="h-4 w-4" aria-hidden="true" />
                  Get advice
                </Button>
              </form>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">
                  AI response
                </p>

                <div className="mt-4 min-h-32">
                  {isLoading ? (
                    <Loader text="Generating advisory response..." />
                  ) : answer ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {answer}
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      The answer will appear here after you submit a question.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AIAssistant;
