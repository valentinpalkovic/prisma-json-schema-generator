import type { DMMF } from '@prisma/generator-helper'

export type PrismaPrimitive =
    | 'String'
    | 'Boolean'
    | 'Int'
    | 'Float'
    | 'Json'
    | 'DateTime'

type ScalarField = DMMF.Field & { type: PrismaPrimitive }

export function isScalarType(field: DMMF.Field): field is ScalarField {
    return field['kind'] === 'scalar'
}

export function isEnumType(field: DMMF.Field): boolean {
    return field['kind'] === 'enum'
}

export function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

export function assertNever(value: never): never {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    )
}
