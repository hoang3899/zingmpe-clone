/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  variants: {
    extend: {
        display: ["group-hover"],
    },
  },
  theme: {
    extend: {
      boxShadow: {
        'xl': '0 0 5px 0 rgb(0 0 0 / 20%)',
      },
      backgroundImage: {
        'logo-dark': "url('./img/logo-dark.svg')",
      },
      width: {
        20:"20px",
        24:"24px",
        38:"38px",
        40:"40px",
        120:"120px",
        150: "150px",
        190: "190px",
        225: "225px",
        240: "240px",
        275: "275px",
        300: "300px",
        340: "340px",
        350: "350px",
        375: "375px",
        460: "460px",
        656: "656px",
        880: "880px",
        508: "508px",
        "80vw": "80vw",
        "3.4":"3.4rem"
      },
      height: {
        1:"1px",
        20:"20px",
        24:"24px",
        38:"38px",
        40:"40px",
        70:"70px",
        80: "80px",
        150: "150px",
        225: "225px",
        300: "300px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        650: "650px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
        "3.4":"3.4rem",
      },
      minWidth: {
        210: "210px",
        350: "350px",
        620: "620px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        layoutBg: "#170f23",
        sideBar: "hsla(0,0%,100%,0.05)",
        alphaBg: "hsla(0,0%,100%,0.1)",
        textItemHover: "#fff",
        purplePrimary: "#7200a1",
        navigationText: "#dadada",
        searchText: "#eee",
        settingIconText: "#d8d8d8",
        loadingBg: "hsla(0,0%,100%,0.1)",
        primaryBg: "#432275",
        borderPrimary:"hsla(0,0%,100%,0.1)",
        songItemAction:"hsla(0,0%,100%,0.5)",
        borderBox:"hsla(0,0%,100%,0.2)",
        darkAlpha50:"rgba(0,0,0,0.5)",
        darkAlpha10:"rgba(0,0,0,0.1)",
        linkTextHover: "#9c32ca",
        playerBg:"rgba(0, 0 , 0, 0.2)",
        darkAlpha80:"rgba(0, 0 , 0, 0.8)",
        tabActiveBg:"hsla(0,0%,100%,0.3)",
        linkTextHover1: "#c662ef",
        artistLayoutBg:"rgba(41,21,71,0.8)",
        boxHotItemBg:"rgba(254,255,255,0.05)",
      },
    },
  },
  plugins: [],
}
