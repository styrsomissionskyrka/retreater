import { format } from '../../../lib/utils/date-fns';
import { Template } from '.';

type InviteData = {
  email: string;
  name?: string | null | undefined;
  ticket: string;
  expires: number | Date;
  from?: string | null | undefined;
};

export const invite: Template<InviteData> = (data) => {
  return {
    subject: 'Välkommen att administrera Styrsö Missionskyrkas retreater',
    text: `
Hej${data.name ? ` ${data.name}` : ''},
Du har blivit inbjuden att administrera Styrsö Missionskyrkas retreater.

Följ länken nedan för att välja ett lösenord och komma igång med ditt konto:

${data.ticket}

Notera att den här länken endast är giltig till och med ${format(data.expires, 'yyyy-MM-dd HH:mm')}.

Med vänliga hälsningar,
${data.from ?? 'Styrsö Missionskyrka'}
    `,
  };
};
