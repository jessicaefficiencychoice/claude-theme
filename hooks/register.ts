import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// The Efficiency Choice palette: navy #354968, cream #F9E9E0, rose #E18589.
// Light mode is cream paper with navy ink and navy buttons.
// Dark mode is a navy page with cream text and rose buttons.
const { theme, problems } = makeColors({
  label: 'Efficiency Choice',
  roles: { danger: '#CF4622', success: '#2E9A5E', warning: '#B87A12', pro: '#8E5B9A' },
  light: {
    roles: { accent: { seed: '#3A5585', fillShade: 600 } },
    gray: {
      anchors: {
        'surface-0': '#F8E8DF',
        'surface-1': '#FBF0E9',
        'surface-2': '#FDF7F3',
        'text-primary': '#1F2A3F',
        'text-secondary': '#354968',
        'text-muted': '#56607A',
      },
    },
  },
  dark: {
    roles: { accent: { seed: '#E18589', fillShade: 300 } },
    gray: {
      anchors: {
        'surface-0': '#141B2A',
        'surface-1': '#192233',
        'surface-2': '#1E283B',
        'surface-3': '#1F2A3E',
        'text-primary': '#F9E9E0',
        'text-secondary': '#DCCDC6',
        'text-muted': '#B2A7A8',
      },
    },
  },
})

// A soft wash of the accent at the top that fades into the page:
// pale navy over cream by day, a rose glow over navy by night.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: {
    gradient: {
      angle: 180,
      stops: [
        { at: 0, color: 'bg-accent' },
        { at: 0.55, color: 'surface-0' },
        { at: 1, color: 'surface-0' },
      ],
    },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const result = await $.theme.set(LOOK)

    if (!result.isDrawn) {
      $.ui.status(result.reason)
    }

    return next(e)
  })
}
