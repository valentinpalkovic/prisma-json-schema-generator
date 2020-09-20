import { DMMF } from '@prisma/generator-helper'

export const fieldUtilities = {
    isRequired: (field: DMMF.Field): boolean => field.isRequired,
    isPrimary: (field: DMMF.Field): boolean => field.isId,
}
