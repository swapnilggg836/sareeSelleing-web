
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				crimson: {
					50: '#FDF2F4',
					100: '#FCE5E9',
					200: '#F9CDD5',
					300: '#F4A7B5',
					400: '#ED758D',
					500: '#E3475B',
					600: '#D32E44',
					700: '#B0203A',
					800: '#921F35',
					900: '#7A1F33',
					950: '#440D17',
				},
				gold: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					950: '#451A03',
				},
				cream: '#FFFDE7',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
			fontFamily: {
				serif: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['Montserrat', 'system-ui', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				montserrat: ['Montserrat', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			transitionDuration: {
				'700': '700ms',
				'900': '900ms',
				'1100': '1100ms',
				'1200': '1200ms',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideInFromTop: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideInFromBottom: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				kenBurns: {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.08)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				heroSlideUp: {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				salePulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.75' }
				},
				heartPop: {
					'0%': { transform: 'scale(1)' },
					'40%': { transform: 'scale(1.3)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)' }
				},
				cartBounce: {
					'0%': { transform: 'scale(1)' },
					'30%': { transform: 'scale(1.35)' },
					'60%': { transform: 'scale(0.88)' },
					'80%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)' }
				},
				scrollLeft: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				dashFill: {
					from: { width: '0%' },
					to: { width: '100%' }
				},
				trustFade: {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				countUp: {
					'from': { opacity: '0', transform: 'translateY(12px)' },
					'to': { opacity: '1', transform: 'translateY(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-in-from-top': 'slideInFromTop 0.5s ease-out',
				'slide-in-from-bottom': 'slideInFromBottom 0.5s ease-out',
				'ken-burns': 'kenBurns 7s ease-out forwards',
				'shimmer': 'shimmer 3.5s ease-in-out infinite',
				'hero-slide-up': 'heroSlideUp 0.65s cubic-bezier(.16,1,.3,1) both',
				'sale-pulse': 'salePulse 2s ease-in-out infinite',
				'heart-pop': 'heartPop 0.35s ease-out',
				'cart-bounce': 'cartBounce 0.4s cubic-bezier(.36,.07,.19,.97)',
				'scroll-left': 'scrollLeft 30s linear infinite',
				'dash-fill': 'dashFill 5s linear forwards',
				'trust-fade': 'trustFade 0.5s ease-out both',
				'count-up': 'countUp 0.6s cubic-bezier(.16,1,.3,1) both',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
