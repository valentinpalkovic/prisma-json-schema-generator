import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { TransformOptions } from './types'
import { DEFINITIONS_ROOT, DEFINITIONS_ROOT_OPENAPI } from './constants'
import { toCamelCase } from './helpers'

import { getInitialJSON } from './jsonSchema'
import { getJSONSchemaModel, getRelations } from './model'
import { OpenAPIV3 } from 'openapi-types'

function getPropertyDefinition({
    schemaId,
    openapiCompatible,
}: TransformOptions) {
    return (
        model: DMMF.Model,
    ): [name: string, reference: JSONSchema7Definition] => {
        const ref = `${
            openapiCompatible !== 'false'
                ? DEFINITIONS_ROOT_OPENAPI
                : DEFINITIONS_ROOT
        }${model.name}`
        return [
            toCamelCase(model.name),
            openapiCompatible === 'refWithAllOf'
                ? {
                      allOf: [
                          {
                              $ref: schemaId ? `${schemaId}${ref}` : ref,
                          },
                      ],
                  }
                : {
                      $ref: schemaId ? `${schemaId}${ref}` : ref,
                  },
        ]
    }
}

export function transformDMMF(
    dmmf: DMMF.Document,
    transformOptions: TransformOptions = {
        openapiCompatible: 'false',
    },
): JSONSchema7 | OpenAPIV3.Document {
    // TODO: Remove default values as soon as prisma version < 3.10.0 doesn't have to be supported anymore
    const { models = [], enums = [], types = [] } = dmmf.datamodel
    const initialJSON = getInitialJSON(transformOptions)
    const { schemaId } = transformOptions

    const relations = getRelations(models)

    const modelDefinitionsMap = models.map((model) =>
        getJSONSchemaModel(
            { enums, name: model.name },
            transformOptions,
            relations,
        )(model),
    )

    const typeDefinitionsMap = types.map((model) =>
        getJSONSchemaModel(
            { enums, name: model.name },
            transformOptions,
            relations,
        )(model),
    )

    const modelPropertyDefinitionsMap = models.map(
        getPropertyDefinition(transformOptions),
    )
    const definitions = Object.fromEntries([
        ...modelDefinitionsMap,
        ...typeDefinitionsMap,
    ])

    const properties = Object.fromEntries(modelPropertyDefinitionsMap)

    if (transformOptions.openapiCompatible !== 'false') {
        return {
            ...initialJSON,
            components: {
                schemas: definitions as {
                    [key: string]: OpenAPIV3.SchemaObject
                },
            },
            paths: {
                '/model/{name}': {
                    get: {
                        responses: {
                            '200': {
                                description: 'model',
                                content: {
                                    'application/json': {
                                        schema: {
                                            oneOf: modelPropertyDefinitionsMap.map(
                                                (prop) => {
                                                    return prop[1] as OpenAPIV3.SchemaObject
                                                },
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                    },
                    parameters: [
                        {
                            schema: {
                                type: 'string',
                            },
                            name: 'name',
                            in: 'path',
                            required: true,
                        },
                    ],
                },
            },
        }
    }

    return {
        ...(schemaId ? { $id: schemaId } : null),
        ...initialJSON,
        definitions,
        properties,
    }
}
