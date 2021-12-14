import { DMMF } from '@prisma/generator-helper'
import { DEFINITIONS_ROOT } from './constants'
import {
    assertNever,
    isEnumType,
    isDefined,
    isScalarType,
    PrismaPrimitive,
} from './helpers'
import {
    ModelMetaData,
    PropertyMap,
    PropertyMetaData,
    TransformOptions,
} from './types'

import type {
    JSONSchema7,
    JSONSchema7Definition,
    JSONSchema7TypeName,
} from 'json-schema'
import { assertFieldTypeIsString } from './assertions'

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

function getDefaultValue(field: DMMF.Field): JSONSchema7['default'] {
    const fieldDefault = field.default

    if (!field.hasDefaultValue) {
        return null
    }

    if (field.kind === 'enum') {
        return typeof fieldDefault === 'string' ? fieldDefault : null
    }

    if (!isScalarType(field)) {
        return null
    }

    switch (field.type) {
        case 'String':
        case 'BigInt':
        case 'DateTime':
            return typeof fieldDefault === 'string' ? fieldDefault : null
        case 'Int':
        case 'Float':
        case 'Decimal':
            return typeof fieldDefault === 'number' ? fieldDefault : null
        case 'Boolean':
            return typeof fieldDefault === 'boolean' ? fieldDefault : null
        case 'Json':
        case 'Bytes':
            return null
        default:
            return assertNever(field.type)
    }
}

function getFormatByDMMFType(
    fieldType: DMMF.Field['type'],
): string | undefined {
    switch (fieldType) {
        case 'DateTime':
            return 'date-time'
        default:
            return
    }
}

function getJSONSchemaForPropertyReference(
    field: DMMF.Field,
    { schemaId }: TransformOptions,
): JSONSchema7 {
    const notNullable = field.isRequired || field.isList

    assertFieldTypeIsString(field.type)

    const typeRef = `${DEFINITIONS_ROOT}${field.type}`
    const ref = { $ref: schemaId ? `${schemaId}${typeRef}` : typeRef }
    return notNullable ? ref : { anyOf: [ref, { type: 'null' }] }
}

function getItemsByDMMFType(
    field: DMMF.Field,
    transformOptions: TransformOptions,
): JSONSchema7['items'] {
    return (isScalarType(field) && !field.isList) || isEnumType(field)
        ? undefined
        : isScalarType(field) && field.isList
        ? { type: getJSONSchemaScalar(field.type) }
        : getJSONSchemaForPropertyReference(field, transformOptions)
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

export function getJSONSchemaProperty(
    modelMetaData: ModelMetaData,
    transformOptions: TransformOptions,
) {
    return (field: DMMF.Field): PropertyMap => {
        const type = getJSONSchemaType(field)
        const format = getFormatByDMMFType(field.type)
        const items = getItemsByDMMFType(field, transformOptions)
        const enumList = getEnumListByDMMFType(modelMetaData)(field)
        const defaultValue = getDefaultValue(field)

        const definition: JSONSchema7Definition = {
            type,
            ...(isDefined(defaultValue) && { default: defaultValue }),
            ...(isDefined(format) && { format }),
            ...(isDefined(items) && { items }),
            ...(isDefined(enumList) && { enum: enumList }),
        }

        const propertyMetaData: PropertyMetaData = {
            required: field.isRequired,
        }

        return [
            field.name,
            isSingleReference(field)
                ? getJSONSchemaForPropertyReference(field, transformOptions)
                : definition,
            propertyMetaData,
        ]
    }
}
