import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F4F71",
        secondary: "#B5882D",
        textDark: "#141414",
        darkBg: "#000000",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          extend: "dark",
          colors: {
            background: "#000000",
            foreground: "#ffffff",
            primary: {
              // 50: "#030e21",
              // 100: "#0b2542",
              // 200: "#113454",
              // 300: "#184366",
              // 400: "#1f4f71",
              // 500: "#4c809c",
              // 600: "#8db6c7",
              // 700: "#b4d1db",
              // 800: "#dfecf0",
              // 900: "#edf5f7",
              // 900: '#061933',
              // 950: '#030e21'
              DEFAULT: "#ffffff",
              foreground: "#ffffff",
            },
            content4: "#0D001A",
            focus: "#4c809c",
          },
        },
        light: {
          extend: "light",
          colors: {
            background: "#FFFFFF",
            // foreground: "#ffffff",
            primary: {
              // 50: "#030e21",
              // 100: "#0b2542",
              // 200: "#113454",
              // 300: "#184366",
              // 400: "#1f4f71",
              // 500: "#4c809c",
              // 600: "#8db6c7",
              // 700: "#b4d1db",
              // 800: "#dfecf0",
              // 900: "#edf5f7",
              // 900: '#061933',
              // 950: '#030e21'
              DEFAULT: "#1f4f71",
              foreground: "#ffffff",
            },
            // content4: "#0D001A",
            focus: "#4c809c",
          },
        },
      },
    }),
  ],
  darkMode: "class",
};
export default config;
