import json from "@rollup/plugin-json";
import { swc, defineRollupSwcOption } from "rollup-plugin-swc3";
import { defineConfig } from "rollup";
import { Command } from "commander";
const program = new Command();
program.option("-w, --watch", "watch mode");
program.option("-c, --config <path>", "config file path");
program.option("-pn, --pack-name <name>", "package name");

program.parse(process.argv);

const opts = program.opts();

const packName = opts.packName;

const packBase = `packages/${packName}`;

export default defineConfig({
  input: `${packBase}/src/index.ts`,
  output: [
    {
      file: `${packBase}/dist/wekit-${packName}.cjs.js`,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: `${packBase}/dist/wekit-${packName}.esm.js`,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    swc(
      defineRollupSwcOption({
        tsconfig: "tsconfig.json",
        sourceMaps: true,
        jsc: {
          externalHelpers: true,
        },
      })
    ),
  ],
});
