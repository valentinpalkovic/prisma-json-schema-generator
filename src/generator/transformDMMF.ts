import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema7 } from 'json-schema'

import { getInitialJSON } from './jsonSchema'
import { getJSONSchemaModel } from './model'

export function transformDMMF(dmmf: DMMF.Document): JSONSchema7 {
    const { models, enums } = dmmf.datamodel
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(getJSONSchemaModel({ enums }))
    const definitions = Object.fromEntries(modelDefinitionsMap)

    return {
        ...initialJSON,
        definitions,
    }
}
