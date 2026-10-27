import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already installed and running standalone, suppress the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        title="Install storyflixAI as a native Web App on your device"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Add to Home Screen</span>
        <span className="xs:hidden">Install</span>
      </button>

      {/* Installation Guide Modal (for iOS or browsers requiring manual step) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Add storyflixAI to Home Screen</h3>
                  <p className="text-[11px] text-zinc-400">Install as a full-screen native mobile app</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps Guide */}
            {isIOS ? (
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      Tap the Share Button <Share className="w-3.5 h-3.5 text-blue-400 inline" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      In the bottom toolbar of Safari on your iPhone or iPad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Scroll down in the share sheet and tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-white">Browser Menu / Install Icon</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Tap the <strong>three dots menu (⋮)</strong> in Chrome/Edge, or click the <strong>Install App</strong> icon in the address bar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-white">Tap "Install" or "Add to Home Screen"</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      storyflixAI will appear directly on your home screen with its own full-screen app icon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
