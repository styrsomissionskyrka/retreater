import { Fragment } from 'react';

import { CopyInline } from '../CopyInline';
import { Link } from '../Link';

export type GridArea = 'status' | 'owner' | 'retreat' | 'payments' | 'refunds';

export const PageLayout: React.FC = ({ children }) => {
  return <div className="grid grid-cols-2 gap-8">{children}</div>;
};

export const PageSection: React.FC<{ span?: number; title?: React.ReactNode }> = ({ span = 2, title, children }) => {
  return (
    <section
      className="border border-black rounded-md overflow-hidden shadow-md divide-y divide-black"
      style={{ gridColumn: `span ${span}` }}
    >
      {title ? <h2 className="px-4 py-2 bg-gray-100 font-semibold text-lg">{title}</h2> : null}
      <div className="p-4 space-y-4">{children}</div>
    </section>
  );
};

type Definition = {
  key: string;
  value: React.ReactNode;
  copyable?: boolean;
  link?: string;
};

export const DefinitionList: React.FC<{ defs: Definition[] }> = ({ defs }) => {
  return (
    <dl className="w-full grid gap-x-4 gap-y-0" style={{ gridTemplateColumns: 'min-content auto' }}>
      {defs.map((def) => {
        let dd: React.ReactNode;
        switch (true) {
          case def.copyable:
            dd = <CopyInline>{def.value as string}</CopyInline>;
            break;
          case def.link != null:
            dd = <Link href={def.link as string}>{def.value}</Link>;
            break;
          default:
            dd = def.value;
        }

        return (
          <Fragment key={def.key}>
            <dt className="font-semibold">{def.key}:</dt>
            <dd>{dd}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
};
