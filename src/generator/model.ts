import { Dictionary, DMMF } from '@prisma/generator-helper'
import { JSONSchema7Definition } from 'json-schema'
import { isEnumType, isScalarType } from './helpers'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData } from './types'

function getRelationScalarFields(model: DMMF.Model): string[] {
    return model.fields.flatMap(
        (field) => (field.relationFromFields as string[] | undefined) || [],
    )
}

function filterReferences(field: DMMF.Field): boolean {
    return isScalarType(field) || isEnumType(field)
}

function filterRelationaScalarFields(model: DMMF.Model): DMMF.Field[] {
    const relationScalarFields = getRelationScalarFields(model)
    return model.fields.filter((field) => {
        return !relationScalarFields.includes(field.name)
    })
}

export function getJSONSchemaModel(
    modelMetaData: ModelMetaData,
    options?: Dictionary<string>,
) {
    return (model: DMMF.Model): DefinitionMap => {
        const usedFields =
            options?.skipReferences == 'true'
                ? filterRelationaScalarFields(model).filter(filterReferences)
                : filterRelationaScalarFields(model)

        const definitionPropsMap = usedFields.map(
            getJSONSchemaProperty(modelMetaData),
        )

        const propertiesMap = definitionPropsMap.map(
            ([name, definition]) => [name, definition] as DefinitionMap,
        )

        const requiredFields = usedFields
            .filter((field) => {
                return field.isRequired && !field.hasDefaultValue
            })
            .map((field) => {
                return field.name
            })

        const properties = Object.fromEntries(propertiesMap)

        const definition: JSONSchema7Definition = {
            type: 'object',
            properties,
            required: requiredFields,
        }

        return [model.name, definition]
    }
}
