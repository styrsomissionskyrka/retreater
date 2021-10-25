import { Fragment } from 'react';

import { styled } from 'styles/stitches.config';

import { CopyInline } from '../CopyInline';
import { Link } from '../Link';

export type GridArea = 'status' | 'owner' | 'retreat' | 'payments' | 'refunds';

export const PageLayout = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$8',
});

const PageSectionWrapper = styled('section', {
  border: '1px solid $black',
  borderRadius: '$md',
  overflow: 'hidden',
  boxShadow: '$md',
  divideY: '$1',
  divideColor: '$black',
});

const SectionTitle = styled('h2', {
  px: '$4',
  py: '$2',
  backgroundColor: '$gray100',
  fontWeight: '$semibold',
  text: '$lg',
});

const Section = styled('div', {
  padding: '$4',
  spaceY: '$4',
});

export const PageSection: React.FC<{ span?: number; title?: React.ReactNode }> = ({ span = 2, title, children }) => {
  return (
    <PageSectionWrapper style={{ gridColumn: `span ${span}` }}>
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      <Section>{children}</Section>
    </PageSectionWrapper>
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
    <Dl>
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
            <Dt>{def.key}:</Dt>
            <dd>{dd}</dd>
          </Fragment>
        );
      })}
    </Dl>
  );
};

const Dl = styled('dl', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'min-content auto',
  gap: '0 1rem',
});

const Dt = styled('dt', { fontWeight: '$semibold' });
