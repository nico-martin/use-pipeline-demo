import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { usePipeline, UsePipelineStatus } from "use-pipeline";
const App = () => {
    const [evaluating, setEvaluating] = React.useState(false);
    const textareaRef = React.useRef(null);
    const worker = React.useMemo(() => new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
    }), []);
    const [result, setResult] = React.useState([]);
    const { pipe, status, progress } = usePipeline("text-classification", "Xenova/distilbert-base-uncased-finetuned-sst-2-english", {
        //progress_callback: console.log,
        device: ["webgpu", "wasm"],
        dtype: "q4",
    }, worker);
    return (_jsxs("div", { className: "mx-auto mt-4 flex flex-col gap-8 max-w-3xl", children: [_jsx("h1", { className: "font-bold text-2xl", children: "usePipeline Demo" }), _jsxs("p", { children: ["This is a small demo application for the", " ", _jsx("a", { className: "underline", href: "https://github.com/nico-martin/use-pipeline", children: "usePipeline react hook" }), ". It does", " ", _jsx("a", { className: "underline", href: "https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.TextClassificationPipeline", children: "text-classification" }), " ", "using the", " ", _jsx("a", { className: "underline", href: "Xenova/distilbert-base-uncased-finetuned-sst-2-english", children: "Xenova/distilbert-base-uncased-finetuned-sst-2-english" }), " ", "model."] }), _jsx("textarea", { className: "w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600", ref: textareaRef, defaultValue: "I love Transformers.js", rows: 6 }), _jsx("button", { className: "inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:pointer-events-none disabled:bg-indigo-400", disabled: status === UsePipelineStatus.LOADING, onClick: async () => {
                    setEvaluating(true);
                    const text = textareaRef?.current?.value || "";
                    const res = await pipe(text, { top_k: null });
                    setResult(res);
                    setEvaluating(false);
                }, children: status === UsePipelineStatus.LOADING
                    ? `downloading the model (${Math.round(progress)}%)`
                    : evaluating
                        ? "evaluating.."
                        : "evaluate" }), _jsx("h3", { children: "Results" }), _jsx("ul", { children: result.map(({ label, score }) => (_jsxs("li", { children: [label, ": ", score] }, label))) }), _jsx("div", { className: "border-b-1 border-b-gray-300" }), _jsxs("p", { className: "text-xs text-center", children: ["Written by ", _jsx("a", { href: "https://nico.dev", children: "Nico Martin" }), " / Code on", " ", _jsx("a", { href: "https://github.com/nico-martin/use-pipeline-demo", children: "Github" })] })] }));
};
createRoot(document.getElementById("root")).render(_jsx(App, {}));
