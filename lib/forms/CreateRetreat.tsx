import { Fragment, useState } from 'react';
import { gql, TypedDocumentNode, useMutation } from '@apollo/client';
import { IconPlus } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button, ConnectedForm, Dialog, toast } from 'lib/components';
import { CreateRetreatMutation, CreateRetreatMutationVariables, PaginatedRetreat } from 'lib/graphql';
import * as log from 'lib/utils/log';
import { EDIT_RETREAT_FRAGMENT } from './EditRetreat';

export const CREATE_RETREAT_MUTATION: TypedDocumentNode<CreateRetreatMutation, CreateRetreatMutationVariables> = gql`
  mutation CreateRetreat($title: String!) {
    createRetreatDraft(title: $title) {
      ...retreat
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;

const Form = ConnectedForm.createConnectedFormComponents<CreateRetreatMutationVariables>();

export const CreateReatreat: React.FC = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [createRetreat] = useMutation(CREATE_RETREAT_MUTATION, {
    refetchQueries: ['ListRetreats'],
  });

  const handleSubmit: SubmitHandler<CreateRetreatMutationVariables> = async (variables) => {
    try {
      let result = await createRetreat({ variables });
      if (result.errors != null || result.data?.createRetreatDraft == null) {
        log.info('Failed result', result);
        throw new Error('Could not create retreat draft.');
      }

      toast.success('Nytt utkast skapat.');
      // let { id } = result.data.createRetreatDraft;
      // router.push(`/admin/retreater/${id}`);
    } catch (error) {
      toast.error('Det gick inte att skapa retreaten just nu.');
      log.error(error);
    }
  };

  return (
    <Fragment>
      <Button icon={<IconPlus size={16} />} onClick={() => setShowDialog(true)}>
        Ny retreat
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <h2 className="text-xl font-medium mb-8 text-center">Skapa retreat</h2>
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
