'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CreateListDto, createListSchema } from '@workspace/contracts';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Switch } from '@workspace/ui/components/switch';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type Props = {
  onSubmit: (input: CreateListDto) => void;
  disabled?: boolean;
  id?: string;
};

export const CreateListForm = ({ onSubmit, disabled, id }: Props) => {
  const form = useForm({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: '',
      isPublic: false,
    },
    disabled,
  });

  const handleSubmit = async (input: CreateListDto) => {
    onSubmit(input);
    form.reset();
  };

  return (
    <form
      id={id}
      className="space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...field}
                placeholder="List name..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="isPublic"
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Switch {...field} checked={value} onCheckedChange={onChange} />
              <FieldLabel>Public</FieldLabel>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
