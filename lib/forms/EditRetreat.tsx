import { gql, TypedDocumentNode, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Form } from 'lib/components';
import {
  EditRetreatFormQuery,
  EditRetreatFormQueryVariables,
  UpdateRetreatInput,
  UpdateRetreatMutation,
  UpdateRetreatMutationVariables,
} from 'lib/graphql';
import { format, parse } from 'lib/utils/date-fns';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getTime } from 'date-fns';

interface EditRetreatProps {
  retreat: NonNullable<EditRetreatFormQuery['retreat']>;
}

export const EditRetreat: React.FC<EditRetreatProps> = ({ retreat }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_MUTATION);
  const { register, handleSubmit } = useForm<UpdateRetreatInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<UpdateRetreatInput> = async (values) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await mutate({
        variables: { id: retreat.id, input: values },
        optimisticResponse: {
          updateRetreat: {
            ...retreat,
            ...values,
            title: values.title!,
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  let startDate = format(retreat.startDate ?? new Date(), 'yyyy-MM-dd');
  let endDate = format(retreat.endDate ?? new Date(), 'yyyy-MM-dd');
  let markdownProps = Form.useWrapMarkdownRegister(register('content'));

  let setValueAs = (date: string) => {
    return getTime(parse(date, 'yyyy-MM-dd', new Date()));
  };

  return (
    <Form.Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Input label="Titel" type="text" defaultValue={retreat.title} {...register('title')} />
      <Form.Input label="Slug" prefix="/retreater/" type="text" readOnly value={retreat.slug} />
      <Form.Row>
        <Form.Input
          label="Startdatum"
          type="date"
          defaultValue={startDate}
          {...register('startDate', { setValueAs })}
        />
        <Form.Input label="Slutdatum" type="date" defaultValue={endDate} {...register('endDate', { setValueAs })} />
      </Form.Row>
      <Form.Input
        label="Max antal deltagare"
        type="number"
        min={0}
        max={100}
        defaultValue={retreat.maxParticipants ?? 10}
        {...register('maxParticipants', { valueAsNumber: true })}
      />
      <Form.Markdown label="Beskrivning" defaultValue={retreat.content ?? ''} {...markdownProps} />

      <Form.ActionRow>
        <Form.Submit isSubmitting={isSubmitting}>Uppdatera retreat</Form.Submit>
      </Form.ActionRow>
    </Form.Form>
  );
};

export const EDIT_RETREAT_FRAGMENT = gql`
  fragment retreat on Retreat {
    id
    slug
    title
    content
    startDate
    endDate
    maxParticipants
  }
`;

export const EDIT_RETREAT_FORM_QUERY: TypedDocumentNode<EditRetreatFormQuery, EditRetreatFormQueryVariables> = gql`
  query EditRetreatForm($id: ID!) {
    retreat(id: $id) {
      ...retreat
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;

export const UPDATE_RETREAT_MUTATION: TypedDocumentNode<UpdateRetreatMutation, UpdateRetreatMutationVariables> = gql`
  mutation UpdateRetreat($id: ID!, $input: UpdateRetreatInput!) {
    updateRetreat(id: $id, input: $input) {
      ...retreat
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;
