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
  ROLE_FRAGMENT,
} from 'lib/graphql';

import { createConnectedFormComponents } from '../ConnectedForm';
import { Spinner } from '../Spinner';
import { toast } from '../Toast';
import { Dialog, Title } from '../Dialog';

type FormValues = UpdateUserInput & { roles: string[] };

const Form = createConnectedFormComponents<FormValues>();

interface EditUserProps {
  id: string | null;
  onSuccess: () => void;
}

export const EditUser: React.FC<EditUserProps> = ({ id, onSuccess }) => {
  const query = useQuery(EDIT_USER_QUERY, { variables: { id }, skip: id == null });
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const handleSubmit: SubmitHandler<FormValues> = async ({ roles, ...input }) => {
    if (id == null) return;

    await toast.promise(updateUser({ variables: { id, input, roles } }), {
      loading: '...',
      success: 'Användare uppdaterad',
      error: 'Kunde inte uppdatera användare',
    });

    onSuccess();
  };

  return (
    <Dialog isOpen={id != null} mode="sidebar" onDismiss={onSuccess}>
      <Title>Redigera {query.data?.user?.name}</Title>
      {query.state === 'loading' && <Spinner />}
      {query.state === 'error' && <p>Kunde inte hämta data</p>}
      {query.state === 'success' && (
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Input name="email" type="email" defaultValue={query.data.user?.email ?? ''} label="E-post" />
          </Form.Row>
          <Form.Row>
            <Form.Input name="name" defaultValue={query.data.user?.name ?? ''} label="Namn" />
          </Form.Row>
          <Form.Row>
            <Form.Input name="nickname" defaultValue={query.data.user?.nickname ?? ''} label="Smeknamn" />
          </Form.Row>
          <Form.Row>
            <Form.CheckboxList
              name="roles"
              defaultValues={query.data.user?.roles.map((role) => role.id) ?? []}
              options={
                query.data.roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                })) ?? []
              }
              label="Roller"
            />
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
    roles {
      ...RoleFields
    }
  }

  ${USER_FRAGMENT}
  ${ROLE_FRAGMENT}
`;

export const UPDATE_USER_MUTATION: TypedDocumentNode<AdminUpdateUserMutation, AdminUpdateUserMutationVariables> = gql`
  mutation AdminUpdateUser($id: ID!, $input: UpdateUserInput!, $roles: [ID!]!) {
    updateUser(id: $id, input: $input) {
      id
      ...UserFields
    }
    assignUserRoles(id: $id, roles: $roles) {
      id
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;
