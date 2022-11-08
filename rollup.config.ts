import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

const configs: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/mdn.js',
      format: 'cjs'
    },
    plugins: [
      typescript(),
      uglify()
    ]
  }
];

export default configs;
