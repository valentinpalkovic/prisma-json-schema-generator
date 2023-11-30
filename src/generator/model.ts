import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData, TransformOptions } from './types'

function getRelationScalarFields(model: DMMF.Model): string[] {
    return model.fields.flatMap((field) => field.relationFromFields || [])
}

const getRelationFieldNames = (model: DMMF.Model): string[] => {
    return model.fields
        .filter(
            (field) =>
                field.relationFromFields?.length ||
                field.relationToFields?.length,
        )
        .map((field) => field.name)
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
        const relationFieldNames = getRelationFieldNames(model)
        const propertiesWithoutRelationScalars = propertiesMap.filter(
            (prop) => !relationScalarFields.includes(prop[0]),
        )

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties: {},
        }

        if (transformOptions.keepRelationScalarFields === 'true') {
            if (transformOptions.keepRelationFields === 'false') {
                definition.properties = Object.fromEntries(
                    propertiesMap.filter(
                        (prop) => !relationFieldNames.includes(prop[0]),
                    ),
                )
            } else {
                definition.properties = Object.fromEntries(propertiesMap)
            }
        } else {
            if (transformOptions.keepRelationFields === 'false') {
                definition.properties = Object.fromEntries(
                    propertiesWithoutRelationScalars.filter(
                        (prop) => !relationFieldNames.includes(prop[0]),
                    ),
                )
            } else {
                definition.properties = Object.fromEntries(
                    propertiesWithoutRelationScalars,
                )
            }
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
