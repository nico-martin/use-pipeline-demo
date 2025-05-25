import { webWorkerPipelineHandler } from "use-pipeline";

self.onmessage = webWorkerPipelineHandler().onmessage;
