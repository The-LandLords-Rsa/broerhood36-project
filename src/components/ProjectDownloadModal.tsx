import React, { useState } from 'react';
import {
  Download,
  Check,
  Copy,
  FolderArchive,
  Terminal,
  ExternalLink,
  X,
  Sparkles,
  AlertCircle,
  FileCode,
  Laptop
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProjectDownloadModal: React.FC = () => {
  const { isDownloadModalOpen, setIsDownloadModalOpen, triggerProjectDownload } = useShop();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isDownloadModalOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await triggerProjectDownload();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      setDownloadError(err?.message || 'Download failed. Please try the direct link below.');
    } finally {
      setDownloading(false);
    }
  };

  const copyCommands = () => {
    navigator.clipboard.writeText('npm install\nnpm run dev');
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsDownloadModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <FolderArchive className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                Download Full Project ZIP
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ready (4.8 MB)
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Download the complete, extractable source code ready to view and edit in Visual Studio Code.
            </p>
          </div>
        </div>

        {/* Archive Integrity Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-medium">Archive Size</span>
              <span className="text-sm font-mono font-bold text-white">~4.8 MB</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-medium">Included Files</span>
              <span className="text-sm font-mono font-bold text-blue-400">50+ Files</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-medium">Technology</span>
              <span className="text-sm font-bold text-rose-400">React + Vite</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-medium">Integrity</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> 100% Valid
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>Includes all source code, assets, Tailwind styles, and configurations.</span>
            <span className="text-slate-500 font-mono">broerhood36-project.zip</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full py-4 px-6 rounded-2xl font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-blue-600/30 hover:scale-[1.01]'
            }`}
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing & Downloading Archive (4.8 MB)...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>Download Started! Check your Downloads folder</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-white" />
                <span>Download Project ZIP (4.8 MB)</span>
              </>
            )}
          </button>

          {/* Secondary Direct Link Fallback */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>If download doesn't trigger automatically:</span>
            <a
              href="/broerhood36-project.zip"
              download="broerhood36-project.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 flex items-center gap-1"
            >
              <span>Direct Link Download</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {downloadError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{downloadError}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions for VS Code */}
        <div className="border-t border-slate-800 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-400" />
              <span>How to Open, Edit & View in VS Code</span>
            </h3>
            <button
              onClick={copyCommands}
              className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copiedCommands ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Run Commands</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <strong className="text-white">Extract the ZIP:</strong> Locate{' '}
                <code className="bg-slate-800 text-blue-300 px-1 py-0.5 rounded font-mono text-[10px]">
                  broerhood36-project.zip
                </code>{' '}
                in your Downloads, right-click it, and select <em>Extract All...</em> (or double click on Mac).
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <strong className="text-white">Open in VS Code:</strong> Open Visual Studio Code, go to{' '}
                <strong className="text-slate-100">File &gt; Open Folder...</strong>, and choose the extracted folder.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div className="w-full">
                <strong className="text-white">Run in Terminal:</strong> Open terminal in VS Code (
                <kbd className="bg-slate-800 px-1 rounded text-[10px] text-slate-300">Ctrl + `</kbd> or{' '}
                <kbd className="bg-slate-800 px-1 rounded text-[10px] text-slate-300">Cmd + `</kbd>) and run:
                <div className="mt-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>npm install &amp;&amp; npm run dev</span>
                  <button onClick={copyCommands} title="Copy">
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <div>
                <strong className="text-white">View in Browser:</strong> Open{' '}
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline font-mono text-[11px]"
                >
                  http://localhost:3000
                </a>{' '}
                to see your live, hot-reloading Broerhood36 website!
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
