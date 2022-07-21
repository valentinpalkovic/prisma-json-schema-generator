import { JSONSchema7 } from 'json-schema'
import { OpenAPIV3 } from 'openapi-types'
import { TransformOptions } from './types'

export const getInitialJSON = (
    transformOptions: TransformOptions,
): JSONSchema7 | OpenAPIV3.Document => {
    if (transformOptions.openapiCompatible !== 'false') {
        return {
            openapi: '3.0.0',
            info: {
                version: '1.0.0',
                title: 'openapi document',
                description: 'openapi document',
            },
            components: {
                schemas: {},
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
                                            oneOf: [],
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
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {},
        type: 'object',
    }
}
