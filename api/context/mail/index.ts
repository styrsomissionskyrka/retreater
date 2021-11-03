import sendgrid from '@sendgrid/mail';

import { ensure } from '../../../lib/utils/assert';
import * as templates from './templates';

type Templates = typeof templates;
type TemplateName = keyof Templates;
type TemplateData<Key extends TemplateName> = Parameters<Templates[Key]>[0];

sendgrid.setApiKey(ensure(process.env.SENDGRID_API_KEY, 'Env variable SENDGRID_API_KEY must be defined'));

export class MailService {
  #from = 'retreater@styrsomissionskyrka.se';

  async send<T extends TemplateName>(template: T, to: string, data: TemplateData<T>) {
    let { subject, text } = templates[template](data);
    await sendgrid.send({ to, from: this.#from, subject, text });
  }
}

export type Template<Data extends Record<string, unknown>> = (data: Data) => {
  subject: string;
  text: string;
};
