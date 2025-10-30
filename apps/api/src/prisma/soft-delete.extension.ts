import { Prisma } from '@prisma/client';

export const createSoftDeleteExtension = (...models: Prisma.ModelName[]) => {
  const uniqueModels = new Set(models);

  return Prisma.defineExtension({
    model: {
      $allModels: {
        restore<T>(
          this: T,
          args: Prisma.Args<T, 'findUnique'>
        ): Promise<Prisma.Result<T, Prisma.Args<T, 'findUnique'>, 'update'>> {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return (Prisma.getExtensionContext(this) as any).update({
            ...args,
            data: { deletedAt: null },
          });
        },
        softDelete<T>(
          this: T,
          args: Prisma.Args<T, 'delete'>
        ): Promise<Prisma.Result<T, Prisma.Args<T, 'delete'>, 'update'>> {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return (Prisma.getExtensionContext(this) as any).update({
            ...args,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: {
              ...args.where,
              deletedAt: null,
            },
            data: { deletedAt: new Date() },
          });
        },

        softDeleteMany<T>(
          this: T,
          args: Prisma.Args<T, 'deleteMany'>
        ): Promise<
          Prisma.Result<T, Prisma.Args<T, 'deleteMany'>, 'updateMany'>
        > {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return (Prisma.getExtensionContext(this) as any).updateMany({
            ...args,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            where: {
              ...args.where,
              deletedAt: null,
            },
            data: { deletedAt: new Date() },
          });
        },
      },
    },
    query: {
      $allModels: {
        $allOperations: ({ args, query, operation, model }) => {
          if (uniqueModels.size === 0 || uniqueModels.has(model)) {
            if (
              operation === 'findFirstOrThrow' ||
              operation === 'findFirst' ||
              operation === 'findUniqueOrThrow' ||
              operation === 'findUnique' ||
              operation === 'findMany' ||
              operation === 'update' ||
              operation === 'updateMany' ||
              operation === 'updateManyAndReturn' ||
              operation === 'count' ||
              operation === 'delete' ||
              operation === 'deleteMany'
            ) {
              args.where = {
                deletedAt: null,
                ...args.where,
              };
            }
          }

          return query(args);
        },
      },
    },
  });
};
