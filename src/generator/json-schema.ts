import { JSONSchema7 } from 'json-schema'

export const getInitialJSON = (): JSONSchema7 => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {},
})
