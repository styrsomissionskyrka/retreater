import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  USER_FRAGMENT,
  TypedDocumentNode,
  AdminEditUserQuery,
  AdminEditUserQueryVariables,
  AdminUpdateUserMutation,
  AdminUpdateUserMutationVariables,
  UpdateUserInput,
  useQuery,
  useMutation,
} from 'lib/graphql';

import { createConnectedFormComponents } from '../ConnectedForm';
import { Spinner } from '../Spinner';
import { toast } from '../Toast';
import { Dialog, Title } from '../Dialog';

const Form = createConnectedFormComponents<UpdateUserInput>();

interface EditUserProps {
  id: string | null;
  onSuccess: () => void;
}

export const EditUser: React.FC<EditUserProps> = ({ id, onSuccess }) => {
  const { state, data } = useQuery(EDIT_USER_QUERY, { variables: { id }, skip: id == null });
  const [mutate] = useMutation(UPDATE_USER_MUTATION);

  const handleSubmit: SubmitHandler<UpdateUserInput> = async (values) => {
    if (id == null) return;
    await toast.promise(mutate({ variables: { id, input: values } }), {
      loading: '...',
      success: 'Användare uppdaterad',
      error: 'Kunde inte uppdatera användare',
    });

    onSuccess();
  };

  return (
    <Dialog isOpen={id != null} mode="sidebar" onDismiss={onSuccess}>
      <Title>Redigera {data?.user?.name}</Title>
      {state === 'loading' && <Spinner />}
      {state === 'error' && <p>Kunde inte hämta data</p>}
      {state === 'success' && (
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Input name="email" type="email" defaultValue={data?.user?.email ?? ''} label="E-post" />
          </Form.Row>
          <Form.Row>
            <Form.Input name="name" defaultValue={data?.user?.name ?? ''} label="Namn" />
          </Form.Row>
          <Form.Row>
            <Form.Input name="nickname" defaultValue={data?.user?.nickname ?? ''} label="Smeknamn" />
          </Form.Row>

          <Form.ActionRow>
            <Form.Reset>Återställ</Form.Reset>
            <Form.Submit>Spara</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      )}
    </Dialog>
  );
};

export const EDIT_USER_QUERY: TypedDocumentNode<AdminEditUserQuery, AdminEditUserQueryVariables> = gql`
  query AdminEditUser($id: ID!) {
    user(id: $id) {
      id
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;

export const UPDATE_USER_MUTATION: TypedDocumentNode<AdminUpdateUserMutation, AdminUpdateUserMutationVariables> = gql`
  mutation AdminUpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;
