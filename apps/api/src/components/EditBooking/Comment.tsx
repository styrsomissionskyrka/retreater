import { __ } from '@wordpress/i18n';

import { PostBox } from '../PostBox';

export const Comment: React.FC<{ value: unknown }> = ({ value }) => {
  return (
    <PostBox title={__('Comment', 'smk')}>
      <div style={{ display: 'flex', flexFlow: 'column nowrap', marginTop: 12 }}>
        <label htmlFor="comments">{__('Comment', 'smk')}</label>
        <textarea
          name="content"
          id="comments"
          defaultValue={typeof value === 'string' ? value : ''}
          rows={10}
          style={{ padding: 12, marginTop: 8 }}
        />
      </div>
    </PostBox>
  );
};
