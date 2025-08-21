import localFont from "next/font/local";

// custom font
export const metrapolis = localFont({
    src: [
      { path: "../fonts/metrapolis/Metrapolis-ExtraLight.woff2", weight: "200", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-Thin.woff2", weight: "100", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-Bold.woff2", weight: "700", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-ExtraBold.woff2", weight: "800", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-Regular.woff2", weight: "400", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-Medium.woff2", weight: "500", style: "normal" },
      { path: "../fonts/metrapolis/Metrapolis-Black.woff2", weight: "900", style: "normal" },
    ],
    variable: "--font-metrapolis",
  });