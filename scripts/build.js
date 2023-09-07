const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const sveltePlugin = require("esbuild-svelte");
const { copy } = require("esbuild-plugin-copy");

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const deploy = args.includes("--build");

const plugins = [
  sassPlugin(),
  sveltePlugin({
    mainFields: ["svelte", "browser", "module", "main"],
  }),
  copy({
    // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
    // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
    resolveFrom: "cwd",
    assets: [
      {
        from: ["./static/*"],
        to: ["./build/static"],
        keepStructure: true,
      },
      {
        from: ["manifest.json"],
        to: ["./build/manifest.json"],
      },
    ],
  }),
];

let opts = {
  entryPoints: [
    "src/background.js",
    "src/nice-select2.js",
    "src/nice-select2.css",
    "src/content.js",
    "src/searchTable.js",
    "src/content.css",
  ],
  bundle: true,
  minify: false,
  outdir: "build",
  plugins: plugins,
  loader: {
    ".js": "jsx",
    ".svg": "dataurl",
    ".html": "text",
  },
  logLevel: "info",
};

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };

  esbuild.context(opts).then((context) => {
    context.watch();
    console.log("Watching ....");
  });
}

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };

  console.log("Building release ...");
  esbuild.build(opts);
}
