import './EditBooking.css';

import { Fragment, useLayoutEffect } from 'react';

import { Comment } from './Comment';
import { ParticipantMeta } from './ParticipantMeta';
import { Save } from './Save';
import { Publish } from './Publish';
import { Title } from './Title';
import { Price } from './Price';

interface EditBookingProps {
  initialData: FormData;
}

export const EditBooking: React.FC<EditBookingProps> = ({ initialData }) => {
  useLayoutEffect(() => {
    let poststuff = document.getElementById('poststuff');
    if (poststuff) poststuff.classList.add('ready');
  }, []);

  return (
    <Fragment>
      <Title value={initialData.get('post_title')} />
      <Price />
      <ParticipantMeta />
      <Comment value={initialData.get('content')} />
      <Publish status={initialData.get('original_post_status')} />
      <Save />
    </Fragment>
  );
};
