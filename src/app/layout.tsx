import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'TrainCo - AI-Powered Career Platform',
  description: 'Where growth meets opportunity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#09090b" />
        
        <Script id="uiframework-config" strategy="beforeInteractive">
          {`
            window.UIFRAMEWORK_AUTO_INIT = true;
            window.UIFrameworkPreInitConfig = {
              explicitTenantUuid: "4e93127e-0dcc-432b-8c27-ed32f064d59e",
              autoConnect: false,
              autoConnectAvatar: false,
              autoConnectVoice: false,
              waitForAvatarBeforeVoice: true,
              voiceUIVisible: false,
              muteByDefault: false,
              enableVoiceChat: true,
              enableAvatar: true,
              lightboard: {
                enabled: false,
              },
            };
          `}
        </Script>

        <Script id="site-functions" strategy="beforeInteractive">
          {`
            (function registerUIFrameworkSiteFunctions() {
              const navigationBridge = {
                navigateToSection(data) {
                  console.warn("[UIFramework] navigateToSection called before React initialized:", data);
                  return false;
                },
              };

              const volumeBridge = {
                setVolume(level) {
                  if (typeof level !== "number") return undefined;
                  if (typeof window !== "undefined" && window.teleVolume && typeof window.teleVolume.setVolume === "function") {
                    window.teleVolume.setVolume(level);
                    return true;
                  }
                  return undefined;
                },
              };

              const mcpBridge = {
                fetchJobs() { console.warn("[mcpBridge] fetchJobs called before React initialized"); return undefined; },
                fetchSkills() { console.warn("[mcpBridge] fetchSkills called before React initialized"); return undefined; },
                fetchCandidate() { console.warn("[mcpBridge] fetchCandidate called before React initialized"); return undefined; },
                fetchCareerGrowth() { console.warn("[mcpBridge] fetchCareerGrowth called before React initialized"); return undefined; },
                fetchMarketRelevance() { console.warn("[mcpBridge] fetchMarketRelevance called before React initialized"); return undefined; },
                cacheJobApplicants() { console.warn("[employerApplicantsCache] cacheJobApplicants called before React initialized"); return false; },
              };

              const existingRegistry =
                typeof window !== "undefined" && window.UIFrameworkSiteFunctions && typeof window.UIFrameworkSiteFunctions === "object"
                  ? window.UIFrameworkSiteFunctions
                  : {};

              window.UIFrameworkSiteFunctions = {
                ...existingRegistry,
                ...navigationBridge,
                ...volumeBridge,
                ...mcpBridge,
              };

              try {
                window.dispatchEvent(new CustomEvent("UIFrameworkSiteFunctionsReady", {
                  detail: { registry: window.UIFrameworkSiteFunctions },
                }));
              } catch (e) {}
            })();
          `}
        </Script>

        <Script id="employer-mode-override" strategy="beforeInteractive">
          {`
            (function () {
              window.__employerMode = false;
              var _origGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
              navigator.mediaDevices.getUserMedia = function (constraints) {
                if (window.__employerMode && constraints && constraints.audio) {
                  try {
                    var ctx = new AudioContext();
                    var dest = ctx.createMediaStreamDestination();
                    return Promise.resolve(dest.stream);
                  } catch (e) {
                    return Promise.resolve(new MediaStream());
                  }
                }
                return _origGUM(constraints);
              };
            })();
          `}
        </Script>

        <Script 
          src="https://telecdn.s3.us-east-2.amazonaws.com/js/ui-framework-liveavatar.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
