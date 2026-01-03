import { UpdateCommentDto } from '@workspace/contracts';
import { Field, FieldError } from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

type Props = {
  control: Control<UpdateCommentDto>;
};

export const EditCommentFields = ({ control }: Props) => {
  return (
    <Controller
      control={control}
      name="content"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Textarea
            {...field}
            placeholder="What do you think?"
            aria-invalid={fieldState.invalid}
            className="max-h-64"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
