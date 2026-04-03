/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: '0.5rem',
  			md: 'calc(0.5rem - 2px)',
  			sm: 'calc(0.5rem - 4px)',
            xl: '0.75rem',
            full: '9999px'
  		},
        fontFamily: {
            "headline": ["Manrope"],
            "body": ["Inter"],
            "label": ["Inter"],
            "manrope": ["Manrope", "sans-serif"],
            "inter": ["Inter", "sans-serif"]
        },
  		colors: {
            "surface-container-low": "#f3f4f6",
            "secondary-container": "#50dcff",
            "on-background": "#191c1e",
            "tertiary-container": "#006844",
            "secondary-fixed-dim": "#48d7f9",
            "outline": "#737685",
            "on-tertiary-container": "#72e9af",
            "tertiary-fixed": "#82f9be",
            "tertiary": "#004e32",
            "on-error": "#ffffff",
            "surface-container-high": "#e7e8ea",
            "on-tertiary-fixed-variant": "#005235",
            "on-tertiary-fixed": "#002113",
            "surface-container": "#edeef0",
            "primary-fixed": "#dae2ff",
            "surface": "#f8f9fb",
            "on-secondary-fixed-variant": "#004e5d",
            "surface-dim": "#d9dadc",
            "on-secondary-fixed": "#001f27",
            "on-surface-variant": "#434654",
            "error-container": "#ffdad6",
            "on-primary": "#ffffff",
            "on-tertiary": "#ffffff",
            "on-primary-fixed": "#001848",
            "surface-container-highest": "#e1e2e4",
            "surface-bright": "#f8f9fb",
            "tertiary-fixed-dim": "#65dca4",
            "secondary-fixed": "#afecff",
            "on-error-container": "#93000a",
            "surface-tint": "#0c56d0",
            "inverse-on-surface": "#f0f1f3",
            "error": "#ba1a1a",
            "on-primary-fixed-variant": "#0040a2",
            "surface-container-lowest": "#ffffff",
            "on-surface": "#191c1e",
            "on-secondary-container": "#005f71",
            "primary-fixed-dim": "#b2c5ff",
            "on-secondary": "#ffffff",
            "primary-container": "#0052cc",
            "outline-variant": "#c3c6d6",
            "on-primary-container": "#c4d2ff",
            "inverse-surface": "#2e3132",
            "inverse-primary": "#b2c5ff",
            "surface-variant": "#e1e2e4",
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
  				DEFAULT: '#003d9b',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#00687b',
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
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}