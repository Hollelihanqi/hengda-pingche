import {
  defineConfig,
  presetUno,
  presetAttributify,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: {
    'btn-primary': 'bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-2xl text-center shadow-sm',
    'card-box': 'bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-3',
    'badge-tag': 'bg-emerald-50 text-emerald-600 font-medium px-2 py-1 rounded-lg text-xs',
  },
  theme: {
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
    },
  },
});
