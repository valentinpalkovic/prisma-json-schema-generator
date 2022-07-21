import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'

export interface PropertyMetaData {
    required: boolean
    hasDefaultValue: boolean
    isScalar: boolean
}

export interface ModelMetaData {
    enums: DMMF.DatamodelEnum[]
    name: string
    ids?: string[]
}

export type DefinitionMap = [name: string, definition: JSONSchema7Definition]
export type PropertyMap = [...DefinitionMap, PropertyMetaData]

export interface TransformOptions {
    keepRelationScalarFields?: 'true' | 'false'
    schemaId?: string
    includeRequiredFields?: 'true' | 'false'
    openapiCompatible?: 'true' | 'refWithAllOf' | 'false'
    relationMetadata?: 'true' | 'false'
    propertyName?: 'camelCase' | 'false'
    metadataModelName?: 'snake_case' | 'false'
}
