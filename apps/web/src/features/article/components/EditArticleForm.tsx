'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import Link from 'next/link';
import React, { Suspense } from 'react';
import {
  Controller,
  FieldError as FieldErrorType,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

import { Editor } from '@/features/editor/client';
import Spinner from '@/shared/components/Spinner';

import { editArticleAction } from '../actions/edit-article';
import { ArticleFormData } from '../types';
import { mapFormValuesToContract } from '../utils';
import { articleFormSchema } from '../validation';

type Props = {
  id: string;
  initialData: ArticleFormData;
};

export const EditArticleForm = ({ id, initialData }: Props) => {
  const form = useForm({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData,
  });

  const [editorKey, setEditorKey] = React.useState(0);

  const onSubmit = async (values: ArticleFormData) => {
    const { error, data } = await editArticleAction(
      id,
      mapFormValuesToContract(values)
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Article edited successfully!', {
        action: (
          <Button asChild variant="link">
            <Link href={`/articles/${data.slug}`}>Go To Article</Link>
          </Button>
        ),
      });
    }
  };

  const handleReset = () => {
    form.reset();
    setEditorKey((prev) => prev + 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit article</CardTitle>
        <CardDescription>
          Edit article, adding various blocks of different types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="edit-article-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Article title..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="blocks"
              render={({ field, fieldState }) => {
                const formatErrors = (): { message: string }[] => {
                  if (!fieldState.error) {
                    return [];
                  }

                  if (fieldState.error.message) {
                    return [{ message: fieldState.error.message }];
                  }

                  if (Array.isArray(fieldState.error)) {
                    return fieldState.error.reduce((errors, error, idx) => {
                      if (error) {
                        Object.entries(error).map(([key, value]) => {
                          errors.push({
                            message: `Block #${idx + 1} (${field.value[idx]?.type.toLowerCase()}) - ${key}: ${(value as FieldErrorType).message}`,
                          });
                        });
                      }

                      return errors;
                    }, []);
                  }

                  return [{ message: 'Unknown validation error' }];
                };

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <Suspense fallback={<Spinner className="size-12" />}>
                      <Editor
                        key={editorKey}
                        onChange={field.onChange}
                        initialBlocks={initialData.blocks}
                      />
                    </Suspense>

                    {fieldState.invalid && (
                      <FieldError errors={formatErrors()} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal">
          <Button type="reset" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" form="edit-article-form">
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Editing article...
              </>
            ) : (
              'Edit'
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
