import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData, TransformOptions } from './types'

function getRelationScalarFields(model: DMMF.Model): string[] {
    return model.fields.flatMap((field) => field.relationFromFields || [])
}

export function getJSONSchemaModel(
    modelMetaData: ModelMetaData,
    transformOptions: TransformOptions,
) {
    return (model: DMMF.Model): DefinitionMap => {
        const definitionPropsMap = model.fields.map(
            getJSONSchemaProperty(modelMetaData, transformOptions),
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

        const properties = Object.fromEntries(
            transformOptions?.keepRelationScalarFields === 'true'
                ? propertiesMap
                : propertiesWithoutRelationScalars,
        )

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties,
        }
        if (transformOptions.includeRequiredFields) {
            const required = definitionPropsMap.reduce(
                (filtered: string[], [name, , fieldMetaData]) => {
                    if (
                        fieldMetaData.required &&
                        fieldMetaData.isScalar &&
                        !fieldMetaData.hasDefaultValue
                    ) {
                        filtered.push(name)
                    }
                    return filtered
                },
                [],
            )
            definition.required = required
        }
        return [model.name, definition]
    }
}
