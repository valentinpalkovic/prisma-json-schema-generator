import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import {
    assertNever,
    isEnumType,
    isScalarType,
    PrismaPrimitive,
} from './helpers'
import { ModelMetaData, PropertyMap, PropertyMetaData } from './types'

const DEFINITIONS_ROOT = '#/definitions/'

function getJSONSchemaScalar(fieldType: PrismaPrimitive): JSONSchema7['type'] {
    switch (fieldType) {
        case 'String':
            return 'string'
        case 'Int':
            return 'integer'
        case 'DateTime':
            return 'string'
        case 'Float':
            return 'integer'
        case 'Json':
            return 'object'
        case 'Boolean':
            return 'boolean'
        default:
            assertNever(fieldType)
    }
}

function getJSONSchemaType(field: DMMF.Field): JSONSchema7['type'] {
    const { isList } = field
    return isScalarType(field) && !isList
        ? getJSONSchemaScalar(field.type)
        : field.isList
        ? 'array'
        : isEnumType(field)
        ? 'string'
        : 'object'
}

function getFormatByDMMFType(fieldType: string): string | undefined {
    switch (fieldType) {
        case 'DateTime':
            return 'date-time'
        default:
            return
    }
}

function getItemsByDMMFType(
    field: DMMF.Field,
): JSONSchema7Definition | undefined {
    return (isScalarType(field) && !field.isList) || isEnumType(field)
        ? undefined
        : isScalarType(field) && field.isList
        ? { type: getJSONSchemaScalar(field.type) }
        : { $ref: `${DEFINITIONS_ROOT}${field.type}` }
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

export function getJSONSchemaProperties(modelMetaData: ModelMetaData) {
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

        return [field.name, definition, propertyMetaData]
    }
}
