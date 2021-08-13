import * as path from 'path';

import { unified, Plugin } from 'unified';
import { Root } from 'mdast';
import { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { parse } from 'yaml';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import remarkStrip from 'strip-markdown';
import * as prettier from 'prettier';
import * as tempura from 'tempura';
import * as z from 'zod';

import { format as formatDate } from 'lib/utils/date-fns';

export function templateToHtml(markdown: string, data: Record<string, any>) {
  return unified()
    .use(remarkParse)
    .use(remarkTempura, data)
    .use(remarkFrontmatter, ['yaml'])
    .use(parseFrontmatter)
    .use(remarkHtml)
    .use(remarkPrettier, { parser: 'html', printWidth: 120, htmlWhitespaceSensitivity: 'strict' })
    .process(markdown);
}

export function templateToText(markdown: string, data: Record<string, any>) {
  return unified()
    .use(remarkParse)
    .use(remarkTempura, data)
    .use(remarkFrontmatter, ['yaml'])
    .use(parseFrontmatter)
    .use(transformLinks)
    .use(remarkStrip)
    .use(remarkStringify)
    .use(remarkPrettier, { parser: 'markdown', proseWrap: 'never' })
    .process(markdown);
}

export function extractMetadata(file: VFile) {
  const frontmatterSchema = z.record(z.string());
  return frontmatterSchema.parse(file.data.frontmatter);
}

const parseFrontmatter: Plugin<never[], Root, Root> = () => (tree, file) => {
  visit(tree, 'yaml', (node: any) => {
    let frontmatter = parse(node.value);
    file.data.frontmatter = Object.assign(file.data.frontmatter ?? {}, frontmatter);
  });
};

const transformLinks: Plugin<never[], Root, Root> = () => (tree) => {
  visit(tree, 'link', (node) => {
    let value = `${toString(node)} (${node.url})`;
    Object.assign(node, { type: 'text', value });
  });
};

function remarkTempura(this: any, data: Record<string, any>) {
  let originalParser = this.Parser.bind(this);
  function parser(markdown: string, file: VFile) {
    let render = tempura.compile(markdown, { blocks });

    markdown = render(data);
    Object.assign(file, { value: markdown });

    return originalParser(markdown, file);
  }

  Object.assign(this, { Parser: parser });
}

function remarkPrettier(this: any, options: prettier.Options) {
  let originalCompiler = this.Compiler.bind(this);
  function compiler(...args: any[]) {
    let result = originalCompiler(...args);
    return prettier.format(result, options);
  }

  Object.assign(this, { Compiler: compiler });
}

const formatBlockArgs = z.object({ format: z.string(), date: z.union([z.date(), z.number()]) });
const urlBlockArgs = z.object({ parts: z.array(z.string()) });
const blocks: tempura.Blocks = {
  format(args: unknown) {
    const { date, format } = formatBlockArgs.parse(args);
    return formatDate(date, format);
  },
  url(args: unknown) {
    let { parts } = urlBlockArgs.parse(args);
    let url = new URL(process.env.VERCEL_URL!);
    url.pathname = path.join(...parts);
    return url.toString();
  },
};
