import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	  screens: {
		  phone: "576px",
		  tablet: "768px",
		  // => @media (min-width: 640px) { ... }
		  //large: "992px",

		  laptop: "1024px",
		  // => @media (min-width: 1024px) { ... }

		  desktop: "1280px",
		  // => @media (min-width: 1280px) { ... }
	  },
	  extend: {
		  fontFamily: {
			  sans: ['Work Sans', 'sans-serif'],
			  ruso: ['Russo One', 'sans-serif']
		  },
		  letterSpacing: {
			  'custom': '-0.005em',
		  },
		  boxShadow: {
			  'custom-top': '0px 2px 0px 0px #C1FF3C inset',
			  'custom-bottom': '0px -2px 2px 0px #658E0D inset',
			  'div-shadow-1': '-8px 8px 12px 0px rgba(187, 187, 187, 0.15)',
			  'div-shadow-2': '2px 0px 8px 0px rgba(230, 230, 230, 0.25)',
			  'event-custom': "0px -1px 2px 0px #9FC207 inset"
		  },
		  fontWeight: {
			  regular: "100",
			  thin: "300",
			  normal: "400",
			  "semi-normal": "500",
			  semiBold: "600",
			  bold: "700",
		  },
		  backgroundImage: {
			  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			  'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			  'gradient-green': 'linear-gradient(90deg, #9BE303, #7FBB00)',
			  'gradient-green-2': 'linear-gradient(90deg, #FFFAAD, #E6FF7C)',
			  'gradient-light-green': 'linear-gradient(90deg, #FFFCCC, #EEFFA8)',
			  'gradient-progress-green': 'linear-gradient(90deg, #EBFFC0, #A2EC02)',
		  },
		  borderRadius: {
			  lg: 'var(--radius)',
			  md: 'calc(var(--radius) - 2px)',
			  sm: 'calc(var(--radius) - 4px)'
		  },
		  colors: {
			  background: 'hsl(var(--background))',
			  foreground: 'hsl(var(--foreground))',
			  card: {
				  DEFAULT: 'hsl(var(--card))',
				  foreground: 'hsl(var(--card-foreground))'
			  },
			  popover: {
				  DEFAULT: 'hsl(var(--popover))',
				  foreground: 'hsl(var(--popover-foreground))'
			  },
			  primary: {
				  DEFAULT: 'hsl(var(--primary))',
				  foreground: 'hsl(var(--primary-foreground))'
			  },
			  secondary: {
				  DEFAULT: 'hsl(var(--secondary))',
				  foreground: 'hsl(var(--secondary-foreground))'
			  },
			  muted: {
				  DEFAULT: 'hsl(var(--muted))',
				  foreground: 'hsl(var(--muted-foreground))'
			  },
			  accent: {
				  DEFAULT: 'hsl(var(--accent))',
				  foreground: 'hsl(var(--accent-foreground))'
			  },
			  destructive: {
				  DEFAULT: 'hsl(var(--destructive))',
				  foreground: 'hsl(var(--destructive-foreground))'
			  },
			  border: 'hsl(var(--border))',
			  input: 'hsl(var(--input))',
			  ring: 'hsl(var(--ring))',
			  chart: {
				  '1': 'hsl(var(--chart-1))',
				  '2': 'hsl(var(--chart-2))',
				  '3': 'hsl(var(--chart-3))',
				  '4': 'hsl(var(--chart-4))',
				  '5': 'hsl(var(--chart-5))'
			  },
			  light_grey: "#F9FAFA",
			  'text-grey': "#757C91",
			  'border-grey': "#E3E6ED",
			  "grey-light": "#6F7C86",
			  "black-light": "#121419",
			  "light-green": "#405E00",
			  "mid-green": "#5B8601",
			  "step-color": "#80BC00",
			  "light-yellow": "#F9FCED",
			  "light-black": '#3C4253',
			  "mid-grey": "#F6F7F8",
			  "primary-black": "#1A2600",
			  "grey-20": "#F4F4F6",
			  "grey-40": "#AAAEBB",
			  "grey-30": "#EBECEF",
			  "light-grey-60": "#D8D9DC",
			  "light-grey-50": "#C8CBD3",
			  "light-grey-70": "#E9EAEC",
			  "light-green-10": "#F5FAEB",
			  "light-green-50": "#DEFF99",
			  "light-green-tint": "#BFDD80",
			  "green-tint": "#F2FFD6",
			  "light-white": "#FCFCFC",
			  "warning": "#FDF3E8",
			  "warning-bold": "#EA840D",
			  "light-tint": "#FEFEF0",
			  "light-tint-2": "#6B9D00",
			  "light-tint-3": "#FDFBD8",
			  "light-tint-4": "#EBF4D7",
			  "yellow-tint-1": "#f5fec6",
			  "yellow-tint-2": "#FAF276",
			  "purple-tint-1": '#F4EBFF',
			  "grey-80": "#DEE0E5",
			  "grey-90": "#3B4152",
			  "red-1": "#DB0000",
			  "red-2": "#BC0000",
			  "red-3": "#FFEBEB",
			  "light-green-60": "#EBF5EF",
			  "light-green-70": "#009D44",
			  "purple-1": "#F9F5FF",
			  "blue-accent-1": "#5D00D4",
			  "red-accent-1": "#FFEBEB"

		  },
		  height: {
			  "desk-content": "calc(100vh-250px)",
			  "mobile-content": "calc(100vh-50px)",
		  },
	  }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
