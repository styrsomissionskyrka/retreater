import { __ } from '@wordpress/i18n';
import { render } from 'react-dom';

import { EditBooking } from './components/EditBooking';

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post')!;
  const initialData = new FormData(form instanceof HTMLFormElement ? form : undefined);
  const root = document.getElementById('postdivrich');

  render(<EditBooking initialData={initialData} />, root);
});
