import { DMMF as ExternalDMMF } from '@prisma/generator-helper'

export function lowerCase(name: string): string {
    return name.substring(0, 1).toLowerCase() + name.substring(1)
}

export interface DMMFMapping {
    model: string
}

export type DMMFDocument = Omit<ExternalDMMF.Document, 'mappings'> & {
    mappings: DMMFMapping[]
}

export const transformDMMF = (dmmf: ExternalDMMF.Document): DMMFDocument => {
    return dmmf
}
