import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'

export interface PropertyMetaData {
    required: boolean
}

export interface ModelMetaData {
    enums: DMMF.DatamodelEnum[]
}

export type DefinitionMap = [name: string, definition: JSONSchema7Definition]
export type PropertyMap = [...DefinitionMap, PropertyMetaData]

export interface TransformOptions {
    keepRelationScalarFields?: 'true' | 'false'
}
