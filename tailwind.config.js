/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        light: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        strong:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
      },
      gridTemplateColumns: {
        dir: "repeat(auto-fit, minmax(250px, 1fr))",
      },
      screens: {
        vsm: "370px",
        sidebar: "800px",
        xlg: "1300px",
      },
      width: {
        "dashboard-sidebar": "300px",
        "dashboard-content": "calc(100% - 300px)",
      },
      colors: {
        danger: "#ff2a2a",
      },
    },
  },
  plugins: [],
};
