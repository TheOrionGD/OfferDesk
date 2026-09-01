import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const greenPalette = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853',
};

let baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: greenPalette[300],
      main: greenPalette[500],
      dark: greenPalette[700],
      contrastText: '#ffffff',
    },
    secondary: {
      light: greenPalette.A200,
      main: greenPalette.A400,
      dark: greenPalette.A700,
      contrastText: '#000000',
    },
    background: {
      default: '#eef2f7',
      paper: '#eef2f7',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: greenPalette.A700,
    },
  },
  typography: {
    fontFamily: [
      'Outfit',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    fontSize: 13.5,
    h1: { fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.25 },
    h2: { fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.25 },
    h3: { fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 },
    h4: { fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3 },
    h5: { fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.35 },
    h6: { fontSize: '0.925rem', fontWeight: 800, lineHeight: 1.35 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.4 },
    subtitle2: { fontSize: '0.825rem', fontWeight: 700, lineHeight: 1.4 },
    body1: { fontSize: '0.85rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8rem', lineHeight: 1.5 },
    caption: { fontSize: '0.725rem', lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '8px 18px',
          minHeight: '40px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(0, 200, 83, 0.25)',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        sizeSmall: {
          padding: '6px 14px',
          minHeight: '34px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '10px 22px',
          minHeight: '44px',
          fontSize: '0.9rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#eef2f7',
          boxShadow: '8px 8px 18px #d1d9e6, -8px -8px 18px #ffffff',
          border: '1px solid rgba(255, 255, 255, 0.9)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '16px !important',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          boxShadow: '4px 4px 12px #cbd5e1, -4px -4px 12px #ffffff',
          overflow: 'hidden',
          marginBottom: '10px',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          minHeight: '48px',
          '&.Mui-expanded': { minHeight: '48px' },
        },
        content: {
          margin: '10px 0',
          '&.Mui-expanded': { margin: '10px 0' },
          overflow: 'hidden',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 16px 14px 16px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': { paddingBottom: '16px' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          height: 'auto',
          minHeight: '24px',
          paddingTop: '2px',
          paddingBottom: '2px',
          '& .MuiChip-label': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
  },
});

export const muiTheme = responsiveFontSizes(baseTheme);
export default muiTheme;
