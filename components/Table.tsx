import { styled } from 'styles/stitches.config';

export const Table = styled('table', {
  width: '$full',
  borderCollapse: 'collapse',
  tableLayout: 'auto',
  lineHeight: '$none',
});
Table.displayName = 'Table.Table';

export const Head = styled('thead', {});
Head.displayName = 'Table.Head';

export const HeadRow = styled('tr', { borderBottom: '1px solid $black' });
HeadRow.displayName = 'Table.HeadRow';

export const HeadCell = styled('th', { textAlign: 'left', fontWeight: '$medium', px: '$2', paddingBottom: '$3' });
HeadCell.displayName = 'Table.HeadCell';

export const Body = styled('tbody', { divideY: '$1', text: '$sm' });
Body.displayName = 'Table.Body';

export const BodyRow = styled('tr', { '&:hover': { background: '$gray100' } });
BodyRow.displayName = 'Table.BodyRow';

export const BodyCell = styled('td', {
  padding: '$2',
  height: '$16',
  fontWeight: '$normal',
  textAlign: 'left',
  maxWidth: '10rem',
});
BodyCell.displayName = 'Table.BodyCell';
