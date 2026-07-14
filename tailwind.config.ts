import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // פלטת "מינימליזם חם" - שמנת עדינה, אפור-חום כהה, ירוק-זית מאופק
        cream: "#F9F7F2",
        bone: "#F9F7F2", // alias לשמירה על תאימות לאחור בקומפוננטות קיימות
        ink: "#3D3A36",
        stone: "#8C8579",
        mist: "#E7E2D8",
        olive: "#7A8172",
        rust: "#A85C4A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      maxWidth: {
        editorial: "1360px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
