import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

import {
    assertNever,
    isEnumType,
    isNotUndefined,
    isScalarType,
    PrismaPrimitive,
} from './helpers'
import { getInitialJSON } from './json-schema'

interface PropertyMetaData {
    required: boolean
}

interface ModelMetaData {
    enums: DMMF.DatamodelEnum[]
}

type DefinitionMap = [name: string, definition: JSONSchema7Definition]
type PropertyMap = [...DefinitionMap, PropertyMetaData]

const DEFINITIONS_ROOT = '#/definitions/'

export function lowerCase(name: string): string {
    return name.substring(0, 1).toLowerCase() + name.substring(1)
}

export function mapDMMFScalarToJSONSchemaScalar(
    fieldType: PrismaPrimitive,
): JSONSchema7['type'] {
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

export function getJSONSchemaType(field: DMMF.Field): JSONSchema7['type'] {
    return isScalarType(field)
        ? mapDMMFScalarToJSONSchemaScalar(field.type)
        : field.isList
        ? 'array'
        : isEnumType(field)
        ? 'string'
        : 'object'
}

export function getFormatByDMMFType(fieldType: string): string | undefined {
    switch (fieldType) {
        case 'DateTime':
            return 'date-time'
        default:
            return
    }
}

export function getItemsByDMMFType(
    field: DMMF.Field,
): JSONSchema7Definition | undefined {
    return isScalarType(field) || isEnumType(field)
        ? undefined
        : { $ref: `${DEFINITIONS_ROOT}${field.type}` }
}

export function getEnumListByDMMFType(modelMetaData: ModelMetaData) {
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

export function getRequiredProperties(properties: PropertyMap[]): string[] {
    return properties
        .map(([name, , metaOption]) => (metaOption.required ? name : undefined))
        .filter(isNotUndefined)
}

export function mapDMMFModel(modelMetaData: ModelMetaData) {
    return (model: DMMF.Model): DefinitionMap => {
        const definitionPropsMap = model.fields.map(
            getJSONSchemaProperties(modelMetaData),
        )

        const propertiesMap = definitionPropsMap.map(
            ([name, definition]) => [name, definition] as DefinitionMap,
        )
        const required = getRequiredProperties(definitionPropsMap)
        const properties = Object.fromEntries(propertiesMap)

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties,
            required,
        }

        return [model.name, definition]
    }
}

export function transformDMMF(dmmf: DMMF.Document): JSONSchema7 {
    const { models, enums } = dmmf.datamodel
    console.log(enums[0].values)
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(mapDMMFModel({ enums }))
    const definitions = Object.fromEntries(modelDefinitionsMap)

    return {
        ...initialJSON,
        definitions,
    }
}
