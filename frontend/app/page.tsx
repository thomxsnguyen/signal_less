"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDiagnose = async () => {
    if (!userInput || !file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("user_input", userInput);
    formData.append("pc_info", file);

    const res = await fetch("http://localhost:8000/diagnose", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    localStorage.setItem("diagnosis", JSON.stringify(data));
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-8 py-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 font-bold tracking-widest text-sm">
          SIGNAL<span className="text-white">LESS</span>
        </span>
        <span className="ml-auto text-xs text-gray-500">
          PC DIAGNOSTIC SYSTEM v1.0
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero */}
        <div className="mb-16">
          <p className="text-green-400 text-xs tracking-widest mb-4">
            AMD ROCM POWERED
          </p>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            AI PC
            <br />
            <span className="text-green-400">TROUBLESHOOTER</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg">
            Advanced AI diagnostic system powered by AMD MI300X and Qwen2.5-14B.
            Identify and fix PC problems in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            {
              step: "01",
              title: "Run Script",
              desc: "Download and run our diagnostic script to collect your PC info",
            },
            {
              step: "02",
              title: "Describe Problem",
              desc: "Tell us what issue you are experiencing with your PC",
            },
            {
              step: "03",
              title: "Get Diagnosis",
              desc: "Our AI agents analyze and provide step by step solutions",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="border border-[#1a1a1a] p-4 hover:border-green-500/30 transition-colors"
            >
              <span className="text-green-400 text-xs tracking-widest">
                {item.step}
              </span>
              <h3 className="text-white font-bold mt-1 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Main Form */}
        <div className="border border-[#1a1a1a] p-8 space-y-6">
          {/* Download Script */}
          <div>
            <label className="text-xs text-gray-400 tracking-widest block mb-3">
              STEP 1 — DOWNLOAD & RUN DIAGNOSTIC SCRIPT
            </label>
            <a
              href="/script.py"
              download={true}
              className="inline-flex items-center gap-2 border border-green-500/50 text-green-400 px-4 py-2 text-sm hover:bg-green-500/10 transition-colors"
            >
              {"↓ DOWNLOAD script.py"}
            </a>
            <p className="text-gray-600 text-xs mt-2">
              Run: <code className="text-green-400">python3 script.py</code> in
              your terminal
            </p>
          </div>

          {/* Upload JSON */}
          <div>
            <label className="text-xs text-gray-400 tracking-widest block mb-3">
              STEP 2 — UPLOAD pc_info.json
            </label>
            <div className="border border-dashed border-[#2a2a2a] p-6 text-center hover:border-green-500/30 transition-colors">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <span className="text-green-400 text-sm">
                    {"✓ "}
                    {file.name}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Click to upload pc_info.json
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="text-xs text-gray-400 tracking-widest block mb-3">
              STEP 3 — DESCRIBE YOUR PROBLEM
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. My PC is running really slow, fan is loud, games are stuttering..."
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white p-4 text-sm placeholder-gray-600 focus:border-green-500/50 focus:outline-none resize-none h-28"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleDiagnose}
            disabled={!userInput || !file || loading}
            className="w-full bg-green-500 text-black font-bold py-4 text-sm tracking-widest hover:bg-green-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "ANALYZING..." : "DIAGNOSE MY PC"}
          </button>
        </div>
      </div>
    </main>
  );
}
