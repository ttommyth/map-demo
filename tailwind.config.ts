import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        'icon': '1.5rem',
      },
      colors: {
        'primary': {
          '50': '#fff9eb',
          '100': '#ffedc6',
          '200': '#ffd988',
          '300': '#ffbf4a',
          '400': '#ffa012',
          '500': '#f98207',
          '600': '#dd5c02',
          '700': '#b73d06',
          '800': '#942e0c',
          '900': '#7a270d',
          '950': '#461202',
        },
        "secondary": {
          '50': '#edfaff',
          '100': '#d7f2ff',
          '200': '#b7ebff',
          '300': '#86e0ff',
          '400': '#4dccff',
          '500': '#24aeff',
          '600': '#0c92ff',
          '700': '#077ef9',
          '800': '#0c60c1',
          '900': '#115397',
          '950': '#0f335c',
        },
        'base': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#808080',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#262626',
        },        
        'error':{
          '50': '#fff0f0',
          '100': '#ffdede',
          '200': '#ffc3c2',
          '300': '#ff9897',
          '400': '#ff5c5b',
          '500': '#ff2b29',
          '600': '#f90907',
          '700': '#d20503',
          '800': '#ad0807',
          '900': '#8f0e0d',
          '950': '#4e0201',
        },
        'warn':{          
          '50': '#fafee8',
          '100': '#f6ffc2',
          '200': '#efff89',
          '300': '#eeff45',
          '400': '#f0fc13',
          '500': '#f7f907',
          '600': '#ccbe02',
          '700': '#a38a05',
          '800': '#866b0d',
          '900': '#725711',
          '950': '#433005',
        },
        'success':{        
          '50': '#eefff5',
          '100': '#d6ffeb',
          '200': '#b0ffd8',
          '300': '#74ffba',
          '400': '#30f895',
          '500': '#07f982',
          '600': '#00bc5e',
          '700': '#02934c',
          '800': '#087340',
          '900': '#095e37',
          '950': '#00351c',
        }
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config
