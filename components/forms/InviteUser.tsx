import { Fragment, useState } from 'react';
import { IconSend } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';

import { useInviteUser, InviteUserMutationVariables } from 'lib/graphql';

import { Button } from '../Button';
import * as ConnectedForm from '../ConnectedForm';
import { Dialog, Title } from '../Dialog';
import { toast } from '../Toast';

const Form = ConnectedForm.createConnectedFormComponents<InviteUserMutationVariables>();

export const InviteUser: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [inviteUser] = useInviteUser();

  const handleSubmit: SubmitHandler<InviteUserMutationVariables> = async (variables) => {
    await toast.promise(inviteUser(variables.email), {
      loading: '...',
      success: 'Nytt utkast skapat.',
      error: 'Det gick inte att skapa retreaten just nu.',
    });
  };

  return (
    <Fragment>
      <Button onClick={() => setShowDialog(true)} iconStart={<IconSend size={16} />}>
        Bjud in
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <Title>Bjud in användare</Title>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Input name="email" type="email" defaultValue="" label="E-post" required />
            <Form.Input name="name" defaultValue="" label="Namn" />
          </Form.Row>
          <Form.ActionRow>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Avbryt
            </Button>
            <Form.Submit>Bjud in</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      </Dialog>
    </Fragment>
  );
};
