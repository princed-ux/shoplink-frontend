import { useEffect, useRef } from "react";

const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.L) {
      resolve(window.L);
      return;
    }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    } else {
      setTimeout(() => resolve(window.L), 100);
    }
  });
};

export default function GeoMap({ data, title = "Global Map", height = "400px" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    loadLeaflet().then((L) => {
      if (!L) return;

      const isDark = document.documentElement.classList.contains("dark");

      const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      });

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "&copy; Esri", maxZoom: 19 }
      );

      const darkLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap, &copy; CartoDB",
        maxZoom: 19,
      });

      const defaultLayer = isDark ? darkLayer : streetLayer;

      map.current = L.map(mapContainer.current, {
        layers: [defaultLayer],
      }).setView([20, 0], 2);

      const baseMaps = {
        "Street": streetLayer,
        "Satellite": satelliteLayer,
        "Dark": darkLayer,
      };

      L.control.layers(baseMaps, null, { position: "topright" }).addTo(map.current);

      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.lat && item.lng) {
            const flagSize = Math.min(35, Math.max(20, item.count ? item.count * 2 : 25));
            const isUrl = item.flag?.startsWith("http");
            const flagHtml = isUrl
              ? `<img src="${item.flag}" style="width: ${flagSize}px; height: ${flagSize * 0.75}px; object-fit: cover; border-radius: 3px; display: inline-block;" />`
              : `<span style="font-size: ${flagSize}px; line-height: 1;">${item.flag || "🌍"}</span>`;
            const customIcon = L.divIcon({
              html: `
                <div style="text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                  ${flagHtml}
                </div>
                <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: #059669; color: white; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 12px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${item.count}</div>
              `,
              className: "custom-flag-marker",
              iconSize: [flagSize + 20, flagSize + 40],
              iconAnchor: [(flagSize + 20) / 2, flagSize + 40],
              popupAnchor: [0, -flagSize - 25],
            });

            const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map.current);

            if (item.name || item.value) {
              const popupFlag = isUrl
                ? `<img src="${item.flag}" style="width: 32px; height: 24px; object-fit: cover; border-radius: 3px; display: inline-block; margin-bottom: 8px;" />`
                : `<div style="font-size: 24px; margin-bottom: 8px;">${item.flag || "🌍"}</div>`;
              marker.bindPopup(
                `<div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                  ${popupFlag}
                  <div style="font-weight: bold; font-size: 14px; color: #1f2937; margin-bottom: 4px;">${item.name || "Location"}</div>
                  ${item.value ? `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${item.value}</div>` : ""}
                  ${item.code ? `<div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Code: ${item.code}</div>` : ""}
                </div>`,
                { maxWidth: 200 }
              );
            }
          }
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [data]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-slate-900 dark:text-white text-lg transition-colors">{title}</h3>
      </div>
      <div ref={mapContainer} className="w-full [&_.leaflet-control-zoom-a]:!bg-white [&_.leaflet-control-zoom-a]:dark:!bg-slate-800 [&_.leaflet-control-attribution]:dark:!bg-slate-900/90 [&_.leaflet-control-attribution]:dark:!text-slate-400" style={{ height }} />
    </div>
  );
}
