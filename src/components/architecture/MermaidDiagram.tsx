"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            background: "#1e1e2e", // ctp-base
            primaryColor: "#cba6f7", // ctp-mauve
            primaryTextColor: "#cdd6f4", // ctp-text
            primaryBorderColor: "#313244", // ctp-surface0
            lineColor: "#f5c2e7", // ctp-pink
            secondaryColor: "#11111b", // ctp-crust
            tertiaryColor: "#181825", // ctp-mantle
          },
        });

        // Generate dynamic unique ID for mermaid renderer
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-render-${id}`,
          chart,
        );

        if (active) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (active) {
          setError(true);
        }
      }
    }

    renderDiagram();

    return () => {
      active = false;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="p-4 border border-ctp-red/35 rounded-xl bg-ctp-red/10 text-ctp-red text-xs font-mono">
        Failed to render design diagram block. Check syntax or container bounds.
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-ctp-mantle/40 border border-ctp-surface0 rounded-2xl animate-pulse">
        <span className="text-xs text-ctp-subtext1 font-mono">
          Initialising vector visualization...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .mermaid-svg-container svg {
              max-width: 100% !important;
              height: auto !important;
            }
          `,
        }}
      />
      <div
        ref={containerRef}
        className="mermaid-svg-container w-full overflow-x-auto p-4 md:p-6 bg-ctp-mantle/70 rounded-2xl border border-ctp-surface0/80 flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
