import { DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData, TransformOptions } from './types'
import { toCamel, toSnakeCase } from './helpers'

function getRelationScalarFields(model: DMMF.Model): string[] {
    return model.fields.flatMap((field) => field.relationFromFields || [])
}

export type Relations = {
    [Type: string]: {
        modelDefined: string
        fieldDefined: string
        fieldRef: string
        modelRef: string
        relationFromFields: string[]
        relationToFields: any[]
    }
}

export function getRelations(models: DMMF.Model[]) {
    const relations: Relations = {}

    models.forEach((model) => {
        model.fields.forEach((field) => {
            if (
                field.relationName &&
                field.relationFromFields &&
                field.relationToFields &&
                field.relationFromFields.length &&
                field.relationToFields.length
            ) {
                // console.log(
                //     model.name,
                //     field.name,
                //     field.relationName,
                //     field.relationFromFields,
                //     field.relationToFields,
                // )
                relations[field.relationName] = {
                    ...relations[field.relationName],
                    modelDefined: model.name,
                    fieldDefined: field.name,
                    relationFromFields: field.relationFromFields,
                    relationToFields: field.relationToFields,
                }
            } else if (field.relationName) {
                relations[field.relationName] = {
                    ...relations[field.relationName],
                    fieldRef: field.name,
                    modelRef: model.name,
                }
            }
        })
    })

    return relations
}

export function getJSONSchemaModel(
    modelMetaData: ModelMetaData,
    transformOptions: TransformOptions,
    relations: Relations,
) {
    return (model: DMMF.Model): DefinitionMap => {
        const definitionPropsMap = model.fields.map(
            getJSONSchemaProperty(
                {
                    ...modelMetaData,
                    ids: model.primaryKey ? model.primaryKey.fields : undefined,
                },
                transformOptions,
                relations,
            ),
        )

        const propertiesMap = definitionPropsMap.map(
            ([name, definition]) =>
                [
                    transformOptions.propertyName === 'camelCase'
                        ? toCamel(name)
                        : name,
                    definition,
                ] as DefinitionMap,
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

        if (
            transformOptions.relationMetadata == 'true' &&
            transformOptions.openapiCompatible !== 'false'
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ;(definition as any)['x-prisma-model'] =
                transformOptions.metadataModelName === 'snake_case'
                    ? toSnakeCase(model.name)
                    : model.name
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
