import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { isNotUndefined } from './helpers'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData, PropertyMap } from './types'

function getRequiredProperties(properties: PropertyMap[]): string[] {
    return properties
        .map(([name, , metaOption]) => (metaOption.required ? name : undefined))
        .filter(isNotUndefined)
}

function getRelationScalarFields(model: DMMF.Model): string[] {
    return model.fields.flatMap(
        (field) => (field.relationFromFields as string[] | undefined) || [],
    )
}

export function getJSONSchemaModel(modelMetaData: ModelMetaData) {
    return (model: DMMF.Model): DefinitionMap => {
        const definitionPropsMap = model.fields.map(
            getJSONSchemaProperty(modelMetaData),
        )

        const propertiesMap = definitionPropsMap.map(
            ([name, definition]) => [name, definition] as DefinitionMap,
        )
        const relationScalarFields = getRelationScalarFields(model)
        const propertiesWithoutRelationScalars = propertiesMap.filter(
            (prop) =>
                relationScalarFields.findIndex((field) => field === prop[0]) ===
                -1,
        )
        const required = getRequiredProperties(definitionPropsMap)
        const properties = Object.fromEntries(propertiesWithoutRelationScalars)

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties,
            required,
        }

        return [model.name, definition]
    }
}
