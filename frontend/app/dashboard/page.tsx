"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [diagnosis, setDiagnosis] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("diagnosis");
    if (data) setDiagnosis(JSON.parse(data));
  }, []);

  if (!diagnosis) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white font-mono flex items-center justify-center">
        <p className="text-gray-500">
          No diagnosis data found.{" "}
          <a href="/" className="text-green-400">
            Go back
          </a>
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-8 py-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 font-bold tracking-widest text-sm">
          SIGNAL<span className="text-white">LESS</span>
        </span>
        <span className="ml-auto text-xs text-gray-500">DIAGNOSIS RESULTS</span>
        <a
          href="/"
          className="text-xs text-gray-500 hover:text-green-400 transition-colors ml-4"
        >
          NEW SCAN
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Status Banner */}
        <div className="border border-green-500/30 bg-green-500/5 p-4 mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-400 text-sm tracking-widest">
            DIAGNOSIS COMPLETE
          </span>
        </div>

        {/* Results */}
        <div className="border border-[#1a1a1a] p-8">
          <h2 className="text-xs text-gray-400 tracking-widest mb-6">
            DIAGNOSTIC REPORT
          </h2>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {diagnosis.result}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 border border-[#2a2a2a] text-gray-400 px-4 py-2 text-sm hover:border-green-500/30 hover:text-green-400 transition-colors"
          >
            {"← RUN NEW DIAGNOSIS"}
          </a>
        </div>
      </div>
    </main>
  );
}
