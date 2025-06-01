import React from "react";
import { createRoot } from "react-dom/client";

import { usePipeline, UsePipelineStatus } from "use-pipeline";

const toLabelScore = (obj: any): { label: string; score: number } => ({
  label: obj.label,
  score: obj.score,
});

const unifyResult = (res: any): { label: string; score: number }[] =>
  Array.isArray(res[0])
    ? (res as any[][]).flat().map(toLabelScore)
    : (res as any[]).map(toLabelScore);

const App = () => {
  const [evaluating, setEvaluating] = React.useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [result, setResult] = React.useState<
    Array<{ label: string; score: number }>
  >([]);
  const { pipe, status, progress } = usePipeline(
    "text-classification",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    {
      //progress_callback: console.log,
      device: ["webgpu", "wasm"],
      dtype: "q4",
    },
  );

  return (
    <div className="mx-auto mt-4 flex flex-col gap-8 max-w-3xl">
      <h1 className="font-bold text-2xl">usePipeline Demo</h1>
      <p>
        This is a small demo application for the{" "}
        <a
          className="underline"
          href="https://github.com/nico-martin/use-pipeline"
        >
          usePipeline react hook
        </a>
        . It does{" "}
        <a
          className="underline"
          href="https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.TextClassificationPipeline"
        >
          text-classification
        </a>{" "}
        using the{" "}
        <a
          className="underline"
          href="Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        >
          Xenova/distilbert-base-uncased-finetuned-sst-2-english
        </a>{" "}
        model.
      </p>
      <textarea
        className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        ref={textareaRef}
        defaultValue="I love Transformers.js"
        rows={6}
      />
      <button
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:pointer-events-none disabled:bg-indigo-400"
        disabled={status === UsePipelineStatus.LOADING}
        onClick={async () => {
          setEvaluating(true);
          const text = textareaRef?.current?.value || "";
          const res = await pipe([text, { top_k: 10 }]);
          setResult(unifyResult(res));
          setEvaluating(false);
        }}
      >
        {status === UsePipelineStatus.LOADING
          ? `downloading the model (${Math.round(progress)}%)`
          : evaluating
            ? "evaluating.."
            : "evaluate"}
      </button>
      <h3>Results</h3>
      <ul>
        {result.map(({ label, score }) => (
          <li key={label}>
            {label}: {score}
          </li>
        ))}
      </ul>
      <div className="border-b-1 border-b-gray-300" />
      <p className="text-xs text-center">
        Written by <a href="https://nico.dev">Nico Martin</a> / Code on{" "}
        <a href="https://github.com/nico-martin/use-pipeline-demo">Github</a>
      </p>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
