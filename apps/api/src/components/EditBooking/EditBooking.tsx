import { Fragment } from 'react';

import { Comment } from './Comment';
import { ParticipantMeta } from './ParticipantMeta';
import { Save } from './Save';
import { Status } from './Status';
import { Title } from './Title';

interface EditBookingProps {
  initialData: FormData;
}

export const EditBooking: React.FC<EditBookingProps> = ({ initialData }) => {
  return (
    <Fragment>
      <Title value={initialData.get('post_title')} />
      <ParticipantMeta />
      <Comment value={initialData.get('content')} />
      <Status value={initialData.get('hidden_post_status')} />
      <Save />
    </Fragment>
  );
};
