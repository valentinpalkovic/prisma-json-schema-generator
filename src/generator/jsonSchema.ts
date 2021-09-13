import { JSONSchema7 } from 'json-schema'
import { JSON_SCHEMA_ID } from './constants'

export const getInitialJSON = (): JSONSchema7 => ({
    $id: JSON_SCHEMA_ID,
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {},
    type: 'object',
})
