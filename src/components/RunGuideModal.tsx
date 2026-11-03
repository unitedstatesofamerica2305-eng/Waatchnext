import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Code2 } from 'lucide-react';

interface RunGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunGuideModal: React.FC<RunGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const stackBlitzSnippet = `{
  "name": "cinemood-recommender",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0"
  }
}`;

  const terminalSnippet = `# 1. Clone or extract the project folder
# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev

# 4. Open http://localhost:3000 (or http://localhost:5173) in your browser`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                How to Run in StackBlitz, CodeSandbox & Local
              </h3>
              <p className="text-xs text-slate-400">
                Run CineMood in any browser editor without installing anything locally.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Method 1: StackBlitz */}
          <div className="p-4 rounded-2xl bg-[#141B30] border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2">
              <Globe className="w-4 h-4" />
              <span>Option 1: Run in StackBlitz (Fastest 1-Click)</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>
                Open <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">stackblitz.com</span> and click <strong>New Project &gt; Vite + React + TypeScript</strong>.
              </li>
              <li>
                In the project terminal or dependency manager, install <code className="text-rose-300 bg-slate-900 px-1 py-0.5 rounded">lucide-react</code>.
              </li>
              <li>
                Copy the code files (<code className="text-amber-300">App.tsx</code>, <code className="text-amber-300">mockDatabase.ts</code>, <code className="text-amber-300">recommender.ts</code>, <code className="text-amber-300">types/media.ts</code>) into the project.
              </li>
              <li>The Vite preview refreshes instantly with full state and localStorage tracking!</li>
            </ol>
          </div>

          {/* Method 2: Vercel Deployment */}
          <div className="p-4 rounded-2xl bg-[#141B30] border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
              <Globe className="w-4 h-4" />
              <span>Option 2: Deploy to Vercel (Configured via vercel.json)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <li>Push your code to GitHub / GitLab / Bitbucket.</li>
              <li>Import the repository into <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">vercel.com</span>.</li>
              <li>Vercel automatically detects the Vite framework and uses the included <code className="text-sky-300">vercel.json</code> to route all SPA requests cleanly to <code className="text-sky-300">/index.html</code>.</li>
              <li>Click <strong>Deploy</strong> and your app is live on a custom URL with zero extra setup!</li>
            </ol>
          </div>

          {/* Method 3: CodeSandbox */}
          <div className="p-4 rounded-2xl bg-[#141B30] border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
              <Globe className="w-4 h-4" />
              <span>Option 3: Run in CodeSandbox</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>
                Visit <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">codesandbox.io/s/vite-react-ts</span>.
              </li>
              <li>Add dependency <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">lucide-react</code>.</li>
              <li>Save files — localStorage and dark mode will run identically.</li>
            </ol>
          </div>

          {/* Method 4: Local Dev */}
          <div className="p-4 rounded-2xl bg-[#141B30] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Option 4: Run Locally with Node.js & Vite</span>
              </div>
              <button
                onClick={() => copyToClipboard(terminalSnippet, 'terminal')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
              >
                {copiedSection === 'terminal' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-900">
              {terminalSnippet}
            </pre>
          </div>

          {/* Core Features Verification */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs">
            <h4 className="font-bold text-rose-300 mb-1.5">What makes this app zero-configuration:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ <strong>Client-side state:</strong> All watched items persist automatically in browser localStorage.</li>
              <li>✓ <strong>Strict Hindi Dub filter:</strong> Works via prompt semantic parser or manual toggle.</li>
              <li>✓ <strong>No external database needed:</strong> 24 rich titles with heist, psychological & strategic depth ready out of the box.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
