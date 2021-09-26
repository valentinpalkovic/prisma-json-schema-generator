import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { TransformOptions } from './types'
import { DEFINITIONS_ROOT } from './constants'
import { toCamelCase } from './helpers'

import { getInitialJSON } from './jsonSchema'
import { getJSONSchemaModel } from './model'

function getPropertyDefinition({ schemaId }: TransformOptions) {
    return (
        model: DMMF.Model,
    ): [name: string, reference: JSONSchema7Definition] => {
        const ref = `${DEFINITIONS_ROOT}${model.name}`
        return [
            toCamelCase(model.name),
            {
                $ref: schemaId ? `${schemaId}${ref}` : ref,
            },
        ]
    }
}

export function transformDMMF(
    dmmf: DMMF.Document,
    transformOptions: TransformOptions = {},
): JSONSchema7 {
    const { models, enums } = dmmf.datamodel
    const initialJSON = getInitialJSON()
    const { schemaId } = transformOptions

    const modelDefinitionsMap = models.map(
        getJSONSchemaModel({ enums }, transformOptions),
    )
    const modelPropertyDefinitionsMap = models.map(
        getPropertyDefinition(transformOptions),
    )
    const definitions = Object.fromEntries(modelDefinitionsMap)
    const properties = Object.fromEntries(modelPropertyDefinitionsMap)

    return {
        ...(schemaId ? { $id: schemaId } : null),
        ...initialJSON,
        definitions,
        properties,
    }
}
