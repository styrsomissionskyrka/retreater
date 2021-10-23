import { Fragment } from 'react';

import { CopyInline } from '../CopyInline';
import { Link } from '../Link';
import styles from './PageLayout.module.css';

export type GridArea = 'status' | 'owner' | 'retreat' | 'payments' | 'refunds';

export const PageLayout: React.FC = ({ children }) => {
  return <div className={styles.PageLayout}>{children}</div>;
};

export const PageSection: React.FC<{ span?: number; title?: React.ReactNode }> = ({ span = 2, title, children }) => {
  return (
    <section
      style={{ gridColumn: `span ${span}` }}
      className="border border-black rounded overflow-hidden shadow divide-y divide-black"
    >
      {title ? <h2 className="px-4 py-2 bg-gray-100 font-semibold text-lg">{title}</h2> : null}
      <div className="p-4">{children}</div>
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
    <dl className={styles.DefinitionList}>
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
