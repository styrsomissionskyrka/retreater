import { render } from 'react-dom';
import { __ } from '@wordpress/i18n';

import { EditBooking } from './components/EditBooking';

window.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('post')!;
  const initialData = new FormData(form instanceof HTMLFormElement ? form : undefined);
  const root = document.getElementById('postdivrich');

  render(<EditBooking initialData={initialData} />, root);
});

// const BookingMetaScheme = z.object({
//   name: z.string().nullable().optional(),
//   email: z.string().nullable().optional(),
//   phone: z.string().nullable().optional(),
//   address: z
//     .object({
//       street: z.string().nullable().optional(),
//       postal: z.string().nullable().optional(),
//       city: z.string().nullable().optional(),
//     })
//     .nullable()
//     .optional(),
// });

// function getBookingMetadata() {
//   let result = BookingMetaScheme.safeParse((window as any).SMK_BOOKING_META);
//   if (result.success) return result.data;
//   return {};
// }

// type MetaInput = {
//   value?: string | null;
//   label: string;
//   name: string;
//   type?: string;
// };

// let initialContent = document.querySelector<HTMLTextAreaElement>('[name="content"]')?.value ?? '';
// let meta = getBookingMetadata();
// let inputs: MetaInput[] = [
//   {
//     value: meta.name,
//     label: __('Name', 'smk'),
//     name: '[name]',
//   },
//   {
//     value: meta.email,
//     label: __('E-mail', 'smk'),
//     name: '[email]',
//     type: 'email',
//   },
//   {
//     value: meta.phone,
//     label: __('Phone', 'smk'),
//     name: '[phone]',
//     type: 'tel',
//   },
//   {
//     value: meta.address?.street,
//     label: __('Street', 'smk'),
//     name: '[address][street]',
//   },
//   {
//     value: meta.address?.postal,
//     label: __('Zip code', 'smk'),
//     name: '[address][postal]',
//   },
//   {
//     value: meta.address?.city,
//     label: __('City', 'smk'),
//     name: '[address][city]',
//   },
// ];

// const Meta: React.FC = () => {
//   return (
//     <Fragment>
//       <PostBox title={__('Participant', 'smk')}>
//         <Table>
//           {inputs.map((input) => (
//             <TableInputRow
//               key={input.name}
//               label={input.label}
//               type={input.type ?? 'text'}
//               name={`booking_meta${input.name}`}
//               defaultValue={input.value ?? ''}
//             />
//           ))}
//         </Table>
//       </PostBox>

//       <PostBox title={__('Comment', 'smk')}>
//         <div style={{ display: 'flex', flexFlow: 'column nowrap', marginTop: 12 }}>
//           <label htmlFor="comments">{__('Comment', 'smk')}</label>
//           <textarea
//             name="content"
//             id="comments"
//             defaultValue={initialContent}
//             rows={10}
//             style={{ padding: 12, marginTop: 8 }}
//           />
//         </div>
//       </PostBox>
//     </Fragment>
//   );
// };

// render(<Meta />, document.getElementById('postdivrich'));
