'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpDto, signUpSchema } from '@workspace/contracts';
import { buttonVariants } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
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
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SubmitButton } from '@/shared/components/SubmitButton';

import { signUpAction } from '../actions/sign-up';

export const SignUpForm = () => {
  const form = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordComparison: '',
    },
  });

  const onSubmit = async (data: SignUpDto) => {
    const { message } = await signUpAction(data);

    if (message) {
      toast.error('Sign up failed', {
        description: message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Your email..."
                    autoComplete="email"
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
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Your password..."
                    autoComplete="new-password"
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
              name="passwordComparison"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password Confirmation</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <SubmitButton
            isSubmitting={form.formState.isSubmitting}
            submittingText="Signing Up..."
            form="sign-up-form"
          >
            Sign Up
          </SubmitButton>
          <Link
            className={cn(
              buttonVariants({ variant: 'link', size: 'sm' }),
              'text-xs'
            )}
            href="/login"
          >
            Already have an account?
          </Link>
        </Field>
      </CardFooter>
    </Card>
  );
};
