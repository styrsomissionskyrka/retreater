import { Fragment, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

import { gql, TypedDocumentNode, useMutation } from 'lib/graphql';
import { CreateRetreatMutation, CreateRetreatMutationVariables } from 'lib/graphql';
import * as log from 'lib/utils/log';

import { Button } from '../Button';
import * as ConnectedForm from '../ConnectedForm';
import { Dialog, Title } from '../Dialog';
import { toast } from '../Toast';

export const CREATE_RETREAT_MUTATION: TypedDocumentNode<CreateRetreatMutation, CreateRetreatMutationVariables> = gql`
  mutation CreateRetreat($title: String!) {
    createRetreatDraft(title: $title) {
      id
      title
    }
  }
`;

const Form = ConnectedForm.createConnectedFormComponents<CreateRetreatMutationVariables>();

export const CreateReatreat: React.FC = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [createRetreat] = useMutation(CREATE_RETREAT_MUTATION, {
    refetchQueries: ['ListRetreats'],
  });

  const handleSubmit: SubmitHandler<CreateRetreatMutationVariables> = async (variables) => {
    let result = await toast.promise(createRetreat({ variables }), {
      loading: '...',
      success: 'Nytt utkast skapat.',
      error: 'Det gick inte att skapa retreaten just nu.',
    });

    if (result.data?.createRetreatDraft == null) {
      log.info('Failed result', result);
      throw new Error('Could not create retreat draft.');
    }

    let { id } = result.data.createRetreatDraft;
    router.push(`/admin/retreater/${id}`);
  };

  return (
    <Fragment>
      <Button iconStart={<IconPlus size={16} />} onClick={() => setShowDialog(true)}>
        Ny retreat
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <Title>Skapa retreat</Title>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Input name="title" defaultValue="" label="Titel" required />
          <Form.ActionRow>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Avbryt
            </Button>
            <Form.Submit>Skapa retreat</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      </Dialog>
    </Fragment>
  );
};
