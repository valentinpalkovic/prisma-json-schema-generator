import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData } from './types'

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

        const properties = Object.fromEntries(propertiesWithoutRelationScalars)

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties,
        }

        return [model.name, definition]
    }
}
