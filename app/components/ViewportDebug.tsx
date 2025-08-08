"use client";

import { useEffect } from "react";

export function ViewportDebug() {
  useEffect(() => {
    const div = document.createElement("div");
    div.id = "debug-vp";
    div.style.position = "fixed";
    div.style.right = "8px";
    div.style.bottom = "8px";
    div.style.font = "12px/1.3 ui-monospace,monospace";
    div.style.background = "rgba(0,0,0,.7)";
    div.style.color = "#fff";
    div.style.padding = "8px";
    div.style.borderRadius = "6px";
    div.style.zIndex = "99999";
    document.body.appendChild(div);

    function render() {
      const dpr = window.devicePixelRatio;
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      const vv = window.visualViewport;
      const vvW = vv?.width?.toFixed(0);
      const vvH = vv?.height?.toFixed(0);
      const vvScale = vv?.scale?.toFixed(2);
      div.textContent =
        `inner: ${iw}×${ih}\n` +
        (vv ? `visual: ${vvW}×${vvH} (scale ${vvScale})\n` : "") +
        `DPR: ${dpr}\n` +
        `vh: ${Math.round(window.innerHeight / 100)}px`;
    }

    render();
    window.addEventListener("resize", render);
    window.visualViewport?.addEventListener("resize", render);

    return () => {
      window.removeEventListener("resize", render);
      window.visualViewport?.removeEventListener("resize", render);
      div.remove();
    };
  }, []);

  return null;
}