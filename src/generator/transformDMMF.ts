import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

import {
    assertNever,
    isNotUndefined,
    isScalarType,
    PrismaPrimitive,
} from './helpers'
import { getInitialJSON } from './json-schema'

interface PropertyMetaData {
    required: boolean
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
    const isTypeReferenceList = field.isList
    return isScalarType(field)
        ? mapDMMFScalarToJSONSchemaScalar(field.type)
        : isTypeReferenceList
        ? 'array'
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
    fieldType: DMMF.Field,
): JSONSchema7Definition | undefined {
    return isScalarType(fieldType)
        ? undefined
        : { $ref: `${DEFINITIONS_ROOT}${fieldType.type}` }
}

export function getJSONSchemaProperties(field: DMMF.Field): PropertyMap {
    const type = getJSONSchemaType(field)
    const format = getFormatByDMMFType(field.type)
    const items = getItemsByDMMFType(field)

    const definition: JSONSchema7Definition = {
        type,
        ...(format && { format }),
        ...(items && { items }),
    }

    const propertyMetaData: PropertyMetaData = {
        required: field.isRequired,
    }

    return [field.name, definition, propertyMetaData]
}

export function getRequiredProperties(properties: PropertyMap[]): string[] {
    return properties
        .map(([name, , metaOption]) => (metaOption.required ? name : undefined))
        .filter(isNotUndefined)
}

export function mapDMMFModel(model: DMMF.Model): DefinitionMap {
    const definitionPropsMap = model.fields.map(getJSONSchemaProperties)

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

export function transformDMMF(dmmf: DMMF.Document): JSONSchema7 {
    const { models } = dmmf.datamodel
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(mapDMMFModel)
    const definitions = Object.fromEntries(modelDefinitionsMap)

    return {
        ...initialJSON,
        definitions,
    }
}
