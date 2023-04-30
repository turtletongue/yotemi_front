/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1170px",
      xl: "1560px",
      "2xl": "1736px",
      "3xl": "1955px",
    },
    extend: {
      colors: {
        "yankees-blue": "#14174A",
        "cetacean-blue": "#0F1132",
        "light-cetacean": "#16163a",
        "space-cadet": "#1C1E4E",
        card: "#191a41",
        line: "#27295C",
        "concentrated-blue": "#94B3FD",
        "vivid-light": "#00A3FF",
        "vivid-medium": "#0098EE",
        "vivid-dark": "#008DDC",
        "calendar-date": "#6BB6FF",
        "pale-lavender": "#D4D8FC",
        independence: "#4A5169",
        danger: "#DC3545",
        "danger-dark": "#C12C3B",
      },
      screens: {
        xs: "375px",
      },
      fontFamily: {
        mulish: ["var(--font-mulish)"],
        "noto-sans": ["var(--font-noto-sans)"],
      },
      gridTemplateColumns: {
        cards: "repeat(auto-fill, minmax(0, 23rem))",
        "cards-sm": "repeat(auto-fill, minmax(0, 18rem))",
      },
      backgroundSize: {
        "300%": "300% 100%",
      },
      backgroundPosition: {
        full: "150% 50%",
      },
      backgroundImage: {
        "linear-blue-gradient":
          "repeating-linear-gradient(90deg, #6BE4FF 4.31%, #E57AF7 33.14%, #7291FF 59.52%, #6BE4FF 98.13%)",
        "blue-blue-pink-gradient":
          "linear-gradient(101.45deg, #42C2FF 13.44%, #94B3FD 40.27%, #A3A9FD 79.76%, #FB6BFE 97.47%)",
        "blue-pink-pink-gradient":
          "linear-gradient(107.17deg, #94B3FD -14.18%, #A3A9FD 24.51%, #A6A7FD 24.52%, #FB6BFE 60.45%, #94B3FD 96.08%)",
        "title-blue-gradient":
          "linear-gradient(94.11deg, #42C2FF 1.4%, #85F4FF 105.7%)",
      },
      animation: {
        "gradient-ellipse": "gradient-ellipse 1.5s ease-in-out forwards",
        "gradient-x": "gradient-x 10s ease-in-out infinite",
        "spin-slow": "spin 125s linear infinite",
        "top-bar-to-cross":
          "top-bar-to-cross 0.4s ease-in-out 0s 1 normal forwards",
        "middle-bar-to-cross":
          "middle-bar-to-cross 0.4s ease-in-out 0s 1 normal forwards",
        "bottom-bar-to-cross":
          "bottom-bar-to-cross 0.4s ease-out 0s 1 normal forwards",
        "top-bar-from-cross":
          "top-bar-from-cross 0.4s ease-in-out 0s 1 normal forwards",
        "middle-bar-from-cross":
          "middle-bar-from-cross 0.4s ease-in-out 0s 1 normal forwards",
        "bottom-bar-from-cross":
          "bottom-bar-from-cross 0.4s ease-in-out 0s 1 normal forwards",
      },
      keyframes: {
        "gradient-ellipse": {
          from: {
            "background-size": "300% 100%",
            "background-position": "150% 50%",
          },
          to: {
            "background-size": "300% 100%",
            "background-position": "0% 50%",
          },
        },
        "gradient-x": {
          from: {
            "background-size": "400% 100%",
            "background-position": "100% 50%",
          },
          to: {
            "background-size": "400% 100%",
            "background-position": "-33% 50%",
          },
        },
        "top-bar-to-cross": {
          to: {
            transform: "rotate(-45deg) translate(-7px, 5px)",
          },
        },
        "middle-bar-to-cross": {
          to: {
            transform: "rotateY(90deg)",
          },
        },
        "bottom-bar-to-cross": {
          to: {
            transform: "rotate(45deg) translate(-7px, -6px)",
          },
        },
        "top-bar-from-cross": {
          from: {
            transform: "rotate(-45deg) translate(-7px, 5px)",
          },
          to: {
            transform: "rotate(0) translate(0, 0)",
          },
        },
        "middle-bar-from-cross": {
          from: {
            transform: "rotateY(90deg)",
          },
          to: {
            transform: "rotateY(0)",
          },
        },
        "bottom-bar-from-cross": {
          from: {
            transform: "rotate(45deg) translate(-7px, -6px)",
          },
          to: {
            transform: "rotate(0) translate(0, 0)",
          },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
