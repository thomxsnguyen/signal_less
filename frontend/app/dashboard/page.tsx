"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [pcInfo, setPcInfo] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("diagnosis");
    const pc = localStorage.getItem("pc_info");
    if (data) setDiagnosis(JSON.parse(data));
    if (pc) setPcInfo(JSON.parse(pc));
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

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Status Banner */}
        <div className="border border-green-500/30 bg-green-500/5 p-4 mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-400 text-sm tracking-widest">
            DIAGNOSIS COMPLETE
          </span>
          <span className="ml-auto text-xs text-gray-500">
            {pcInfo?.system?.os} {pcInfo?.system?.version}
          </span>
        </div>

        {/* PC Stats Grid */}
        {pcInfo && (
          <div className="mb-8">
            <h2 className="text-xs text-gray-400 tracking-widest mb-4">
              SYSTEM MONITOR
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* CPU Card */}
              <div className="border border-[#1a1a1a] p-6 hover:border-green-500/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400 tracking-widest">
                    CPU
                  </span>
                  <span className="text-xs text-gray-600 truncate max-w-[200px]">
                    {pcInfo?.cpu?.cpu_model}
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <span className="text-5xl font-bold text-white">
                    {pcInfo?.cpu?.cpu_usage_percent}
                    <span className="text-2xl text-gray-500">%</span>
                  </span>
                  <div className="flex-1 space-y-2 mb-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Cores</span>
                      <span className="text-gray-300">
                        {pcInfo?.cpu?.physical_cores}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Clock</span>
                      <span className="text-gray-300">
                        {pcInfo?.cpu?.cpu_freq?.current_mhz} MHz
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-[#1a1a1a] rounded">
                  <div
                    className="h-1 bg-green-500 rounded transition-all"
                    style={{ width: `${pcInfo?.cpu?.cpu_usage_percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1 block">Load</span>
              </div>

              {/* RAM Card */}
              <div className="border border-[#1a1a1a] p-6 hover:border-green-500/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400 tracking-widest">
                    RAM
                  </span>
                  <span className="text-xs text-gray-600">
                    {pcInfo?.ram?.total_gb} GB Total
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <span className="text-5xl font-bold text-white">
                    {pcInfo?.ram?.usage_percent}
                    <span className="text-2xl text-gray-500">%</span>
                  </span>
                  <div className="flex-1 space-y-2 mb-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Used</span>
                      <span className="text-gray-300">
                        {pcInfo?.ram?.used_gb} GB
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Free</span>
                      <span className="text-gray-300">
                        {pcInfo?.ram?.free_gb} GB
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-[#1a1a1a] rounded">
                  <div
                    className="h-1 bg-green-500 rounded transition-all"
                    style={{ width: `${pcInfo?.ram?.usage_percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1 block">Load</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Network Card */}
              <div className="border border-[#1a1a1a] p-6 hover:border-green-500/20 transition-colors">
                <span className="text-xs text-gray-400 tracking-widest block mb-4">
                  NETWORK
                </span>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">{"↑ Sent"}</span>
                    <span className="text-white text-sm font-bold">
                      {pcInfo?.network?.bytes_sent_mb} MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {"↓ Received"}
                    </span>
                    <span className="text-white text-sm font-bold">
                      {pcInfo?.network?.bytes_received_mb} MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Errors</span>
                    <span
                      className={`text-sm font-bold ${pcInfo?.network?.errors_in > 0 ? "text-red-400" : "text-green-400"}`}
                    >
                      {pcInfo?.network?.errors_in}
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage Card */}
              <div className="border border-[#1a1a1a] p-6 hover:border-green-500/20 transition-colors">
                <span className="text-xs text-gray-400 tracking-widest block mb-4">
                  STORAGE
                </span>
                <div className="space-y-3">
                  {pcInfo?.disk?.partitions
                    ?.slice(0, 3)
                    .map((partition: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">
                            {partition.mountpoint}
                          </span>
                          <span className="text-gray-300">
                            {partition.used_gb}GB / {partition.total_gb}GB
                          </span>
                        </div>
                        <div className="h-1 bg-[#1a1a1a] rounded">
                          <div
                            className={`h-1 rounded transition-all ${partition.usage_percent > 90 ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${partition.usage_percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Top Processes */}
            <div className="border border-[#1a1a1a] p-6 mt-4">
              <span className="text-xs text-gray-400 tracking-widest block mb-4">
                TOP PROCESSES
              </span>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-[#1a1a1a]">
                    <th className="text-left pb-2">Process</th>
                    <th className="text-right pb-2">CPU</th>
                    <th className="text-right pb-2">RAM</th>
                    <th className="text-right pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pcInfo?.processes
                    ?.slice(0, 5)
                    .map((proc: any, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]"
                      >
                        <td className="py-2 text-gray-300">{proc.name}</td>
                        <td className="py-2 text-right text-green-400">
                          {proc.cpu_percent}%
                        </td>
                        <td className="py-2 text-right text-gray-300">
                          {proc.memory_percent}%
                        </td>
                        <td className="py-2 text-right text-gray-500">
                          {proc.status}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Diagnosis Results */}
        <div className="border border-[#1a1a1a] p-8">
          <h2 className="text-xs text-gray-400 tracking-widest mb-6">
            AI DIAGNOSTIC REPORT
          </h2>
          <div className="space-y-4">
            <ReactMarkdown
              components={{
                h3: ({ children }) => (
                  <h3 className="text-green-400 text-xs tracking-widest font-bold mt-6 mb-3 border-b border-[#1a1a1a] pb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-bold">{children}</strong>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 text-sm leading-relaxed mb-2 flex gap-2">
                    <span className="text-green-400 mt-1">→</span>
                    <span>{children}</span>
                  </li>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-3 mb-4">{children}</ol>
                ),
              }}
            >
              {diagnosis.result}
            </ReactMarkdown>
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
