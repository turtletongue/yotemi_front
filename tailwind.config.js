/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "yankees-blue": "#14174A",
        "cetacean-blue": "#0F1132",
        "space-cadet": "#1C1E4E",
      },
      screens: {
        xs: "375px",
      },
      fontFamily: {
        mitr: [
          "var(--font-mitr)",
          "Cantarell",
          "Roboto",
          "Ubuntu",
          "sans-serif",
        ],
        mochiy: [
          "var(--font-mochiy-pop-one)",
          "Cantarell",
          "Roboto",
          "Ubuntu",
          "sans-serif",
        ],
        secular: [
          "var(--font-secular-one)",
          "Cantarell",
          "Roboto",
          "Ubuntu",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "linear-blue-gradient":
          "repeating-linear-gradient(90deg, #6BE4FF 4.31%, #E57AF7 33.14%, #7291FF 59.52%, #6BE4FF 98.13%)",
        "simple-blue-gradient":
          "linear-gradient(277.99deg, #94B3FD -23.59%, #42C2FF 108.21%)",
        "title-blue-gradient":
          "linear-gradient(94.11deg, #42C2FF 1.4%, #85F4FF 105.7%)",
      },
      animation: {
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
  plugins: [],
};
