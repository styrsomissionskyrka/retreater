import * as fs from 'fs/promises';
import * as path from 'path';

import { templateToHtml, templateToText, extractMetadata } from './markdown';

type TemplateName = 'new-order';

interface TemplateRenderResult {
  data: Record<string, string>;
  html: string;
  text: string;
}

export async function compile(template: TemplateName, data: Record<string, any>): Promise<TemplateRenderResult> {
  let markdown = await fs.readFile(path.join(process.cwd(), './api/email-templates', `./${template}.md`), 'utf-8');
  let [htmlFile, textFile] = await Promise.all([templateToHtml(markdown, data), templateToText(markdown, data)]);

  return { html: String(htmlFile).trim(), text: String(textFile).trim(), data: extractMetadata(htmlFile) };
}
