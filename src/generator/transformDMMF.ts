import type { Dictionary, DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { DEFINITIONS_ROOT } from './constants'
import { toCamelCase } from './helpers'

import { getInitialJSON } from './jsonSchema'
import { getJSONSchemaModel } from './model'

function getPropertyDefinition(
    model: DMMF.Model,
): [name: string, reference: JSONSchema7Definition] {
    return [
        toCamelCase(model.name),
        {
            $ref: `${DEFINITIONS_ROOT}${model.name}`,
        },
    ]
}

export function transformDMMF(
    dmmf: DMMF.Document,
    options?: Dictionary<string>,
): JSONSchema7 {
    const { models, enums } = dmmf.datamodel
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(
        getJSONSchemaModel({ enums }, options),
    )
    const modelPropertyDefinitionsMap = models.map(getPropertyDefinition)
    const definitions = Object.fromEntries(modelDefinitionsMap)
    const properties = Object.fromEntries(modelPropertyDefinitionsMap)

    return {
        ...initialJSON,
        $id: typeof options?.id === 'string' ? options?.id : undefined,
        definitions,
        properties,
    }
}
