import { Fragment, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

import { gql, TypedDocumentNode, useMutation } from 'lib/graphql';
import { Button, ConnectedForm, Dialog, toast } from 'lib/components';
import { CreateRetreatMutation, CreateRetreatMutationVariables } from 'lib/graphql';
import * as log from 'lib/utils/log';

export const CREATE_RETREAT_MUTATION: TypedDocumentNode<CreateRetreatMutation, CreateRetreatMutationVariables> = gql`
  mutation CreateRetreat($name: String!) {
    createRetreat(name: $name) {
      id
      name
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

    if (result.data?.createRetreat == null) {
      log.info('Failed result', result);
      throw new Error('Could not create retreat draft.');
    }

    let { id } = result.data.createRetreat;
    router.push(`/admin/retreater/${id}`);
  };

  return (
    <Fragment>
      <Button iconStart={<IconPlus size={16} />} onClick={() => setShowDialog(true)}>
        Ny retreat
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <h2 className="text-xl font-medium mb-8 text-center">Skapa retreat</h2>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Input name="name" defaultValue="" label="Titel" required />
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
