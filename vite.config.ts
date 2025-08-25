import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library build configuration
  if (mode === 'lib') {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'Timeline',
          formats: ['es', 'umd'],
          fileName: (format) => `timeline.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  // Regular app build configuration
  return {
    plugins: [
      react(),
      // The code below enables dev tools like taking screenshots of your site
      // while it is being developed on chef.convex.dev.
      // Feel free to remove this code if you're no longer developing your app with Chef.
      mode === "development"
        ? {
            name: "inject-chef-dev",
            transform(code: string, id: string) {
              if (id.includes("main.tsx")) {
                return {
                  code: `${code}

/* Added by Vite plugin inject-chef-dev */
window.addEventListener('message', async (message) => {
  if (message.source !== window.parent) return;
  if (message.data.type !== 'chefPreviewRequest') return;

  const worker = await import('https://chef.convex.dev/scripts/worker.bundled.mjs');
  await worker.respondToMessage(message);
});
              `,
                  map: null,
                };
              }
              return null;
            },
          }
        : null,
      // End of code for taking screenshots on chef.convex.dev.
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
