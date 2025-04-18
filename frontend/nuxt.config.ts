import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import mkcert from 'vite-plugin-mkcert';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { Environments } from './lib/values/general.values';
import { moonbaseAlpha } from 'viem/chains';

const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV;

const meta = {
  title: 'Apillon POA prebuild solution',
  description: 'Apillon proof of attendance',
  url: 'https://apillon.io/',
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    // https: true,
    // https: {
    //   key: 'C:\\Users\\Urban\\.vite-plugin-mkcert\\dev.pem',
    //   cert: 'C:\\Users\\Urban\\.vite-plugin-mkcert\\cert.pem',
    // },
  },
  runtimeConfig: {
    public: {
      API_BASE: process.env.API_BASE,
      CHAIN_ID: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : moonbaseAlpha.id,
      EMBEDDED_WALLET_CLIENT: process.env.EMBEDDED_WALLET_CLIENT,
      WALLET_CONNECT_PROJECT: process.env.WALLET_CONNECT_PROJECT,
      ENV: env || Environments.dev,
    },
  },

  components: ['~/components/general', '~/components/parts'],

  imports: {
    dirs: ['composables/', 'stores/', 'lib/utils/'],
  },

  modules: [
    ['@nuxtjs/tailwindcss', { cssPath: '~/assets/styles/index.css' }],
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
  ],

  vite: {
    server: {
      allowedHosts: ['68ad-213-229-247-224.ngrok-free.app'],
    },

    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      mkcert(),
      nodePolyfills(),
      {
        name: 'vite-plugin-glob-transform',
        transform(code: string, id: string) {
          if (id.includes('nuxt-icons')) {
            return code.replace(/as:\s*['"]raw['"]/g, 'query: "?raw", import: "default"');
          }
          return code;
        },
      },
    ],

    optimizeDeps: {
      include:
        // must use NODE_ENV (to build production version with dev config)
        process.env.NODE_ENV === Environments.dev ? ['naive-ui', 'vueuc'] : [],
    },
  },

  build: {
    transpile:
      // must use NODE_ENV (to build production version with dev config)
      process.env.NODE_ENV === Environments.prod
        ? ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@juggle/resize-observer']
        : ['@juggle/resize-observer'],
  },

  ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { id: 'kalm' },
      title: meta.title,
      titleTemplate: `%s - ${meta.title}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#070707' },
        { name: 'description', content: meta.description, hid: 'description' },
        { name: 'og:title', content: meta.title, hid: 'og:title' },
        {
          name: 'og:description',
          content: meta.description,
          hid: 'og:description',
        },
        { name: 'og:url', content: meta.url, hid: 'og:url' },
        // { name: 'og:image', content: meta.image },
        { name: 'og:type', content: 'website' },
        { name: 'twitter:title', content: meta.title, hid: 'twitter:title' },
        {
          name: 'twitter:description',
          content: meta.description,
          hid: 'twitter:description',
        },
        { name: 'twitter:url', content: meta.url, hid: 'twitter:url' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],

      link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
    },
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: false,
    families: {
      Inter: {
        wght: [400],
      },
      'IBM Plex Sans': {
        wght: [400, 700],
      },
    },
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-02-21',
});
