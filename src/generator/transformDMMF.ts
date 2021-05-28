import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { TransformOptions } from './types'
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
    transformOptions: TransformOptions = {},
): JSONSchema7 {
    const { models, enums } = dmmf.datamodel
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(
        getJSONSchemaModel({ enums }, transformOptions),
    )
    const modelPropertyDefinitionsMap = models.map(getPropertyDefinition)
    const definitions = Object.fromEntries(modelDefinitionsMap)
    const properties = Object.fromEntries(modelPropertyDefinitionsMap)

    return {
        ...initialJSON,
        definitions,
        properties,
    }
}
