import { Bot, MessageSquareText, SendHorizonal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, EmptyState, Loader, Toast } from "../components/ui";
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

  const trimmedQuestion = question.trim();
  const canSubmit = useMemo(() => trimmedQuestion.length > 0 && !isLoading, [trimmedQuestion, isLoading]);

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

    if (!trimmedQuestion) {
      setError("Please enter a farming question.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setAnswer("");

      const data = await sendAiQuestion(trimmedQuestion);
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
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="mb-8 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI crop advisory
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
              Ask a field question and get practical crop guidance.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Describe the crop, season, soil, symptoms, or decision you are
              working through. The assistant uses the existing AI endpoint and
              returns plain-language recommendations.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <MessageSquareText className="h-6 w-6" aria-hidden="true" />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
                Crop-based prompts
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                Start with your live crop records.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Suggestions are generated from crops returned by the backend,
                so you can quickly ask about records already in the platform.
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
                  <EmptyState
                    title="No crop prompts yet"
                    message="Add crop records in the dashboard to generate question ideas from your own data."
                    action={
                      <Link
                        to="/dashboard"
                        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                      >
                        Add crop records
                      </Link>
                    }
                  />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {suggestionError ? (
                <div className="mb-4">
                  <Toast message={suggestionError} tone="error" />
                </div>
              ) : null}

              {error ? (
                <div className="mb-4">
                  <Toast message={error} tone="error" />
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <label htmlFor="ai-question" className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Farming question
                  </label>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Include crop name, season, soil, symptoms, or weather context when you have it.
                  </p>
                </div>

                <textarea
                  id="ai-question"
                  value={question}
                  onChange={(event) => {
                    setQuestion(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Example: My tomato crop is showing yellow leaves in clay loam soil during rainy season. What should I do first?"
                  rows={9}
                  className="min-h-56 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-950 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  disabled={isLoading}
                  aria-describedby="ai-question-help"
                  required
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p id="ai-question-help" className="text-sm text-slate-500 dark:text-slate-400">
                    {trimmedQuestion.length} characters entered
                  </p>
                  <Button type="submit" isLoading={isLoading} className="w-full sm:w-fit" disabled={!canSubmit}>
                    {!isLoading ? <SendHorizonal className="h-4 w-4" aria-hidden="true" /> : null}
                    {isLoading ? "Generating advice" : "Get advice"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm dark:bg-slate-900 dark:text-green-300">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">
                      AI response
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Practical guidance appears here after submission.
                    </p>
                  </div>
                </div>

                <div className="mt-5 min-h-40 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  {isLoading ? (
                    <Loader text="Generating advisory response..." />
                  ) : answer ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {answer}
                    </p>
                  ) : (
                    <EmptyState
                      title="No AI response yet"
                      message="Submit a farming question to see AI guidance here. Responses preserve line breaks and plain-text formatting."
                    />
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
