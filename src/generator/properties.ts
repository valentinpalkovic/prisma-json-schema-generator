import { DMMF } from '@prisma/generator-helper'
import type {
    JSONSchema7,
    JSONSchema7Definition,
    JSONSchema7TypeName
} from 'json-schema'
import { DEFINITIONS_ROOT, JSON_SCHEMA_ID } from './constants'
import {
    assertNever,
    isEnumType,
    isScalarType,
    PrismaPrimitive
} from './helpers'
import { ModelMetaData, PropertyMap, PropertyMetaData } from './types'


function getJSONSchemaScalar(fieldType: PrismaPrimitive): JSONSchema7TypeName {
    switch (fieldType) {
        case 'Int':
        case 'BigInt':
            return 'integer'
        case 'DateTime':
        case 'Bytes':
        case 'String':
            return 'string'
        case 'Float':
        case 'Decimal':
            return 'number'
        case 'Json':
            return 'object'
        case 'Boolean':
            return 'boolean'
        default:
            assertNever(fieldType)
    }
}

function getJSONSchemaType(field: DMMF.Field): JSONSchema7['type'] {
    const { isList, isRequired } = field
    const scalarFieldType =
        isScalarType(field) && !isList
            ? getJSONSchemaScalar(field.type)
            : field.isList
            ? 'array'
            : isEnumType(field)
            ? 'string'
            : 'object'

    return isRequired || isList ? scalarFieldType : [scalarFieldType, 'null']
}

function getFormatByDMMFType(fieldType: string): string | undefined {
    switch (fieldType) {
        case 'DateTime':
            return 'date-time'
        default:
            return
    }
}

function getJSONSchemaForPropertyReference(field: DMMF.Field): JSONSchema7 {
    const notNullable = field.isRequired || field.isList
    const ref = { $ref: `${JSON_SCHEMA_ID}${DEFINITIONS_ROOT}${field.type}` }
    return notNullable ? ref : { anyOf: [ref, { type: 'null' }] }
}

function getItemsByDMMFType(field: DMMF.Field): JSONSchema7['items'] {
    return (isScalarType(field) && !field.isList) || isEnumType(field)
        ? undefined
        : isScalarType(field) && field.isList
        ? { type: getJSONSchemaScalar(field.type) }
        : getJSONSchemaForPropertyReference(field)
}

function isSingleReference(field: DMMF.Field) {
    return !isScalarType(field) && !field.isList && !isEnumType(field)
}

function getEnumListByDMMFType(modelMetaData: ModelMetaData) {
    return (field: DMMF.Field): string[] | undefined => {
        const enumItem = modelMetaData.enums.find(
            ({ name }) => name === field.type,
        )

        if (!enumItem) return undefined
        return enumItem.values.map((item) => item.name)
    }
}

export function getJSONSchemaProperty(modelMetaData: ModelMetaData) {
    return (field: DMMF.Field): PropertyMap => {
        const type = getJSONSchemaType(field)
        const format = getFormatByDMMFType(field.type)
        const items = getItemsByDMMFType(field)
        const enumList = getEnumListByDMMFType(modelMetaData)(field)

        const definition: JSONSchema7Definition = {
            type,
            ...(format && { format }),
            ...(items && { items }),
            ...(enumList && { enum: enumList }),
        }

        const propertyMetaData: PropertyMetaData = {
            required: field.isRequired,
        }

        return [
            field.name,
            isSingleReference(field)
                ? getJSONSchemaForPropertyReference(field)
                : definition,
            propertyMetaData,
        ]
    }
}
