import { DMMF } from '@prisma/generator-helper'
import assert from 'assert'

export function assertFieldTypeIsString(
    fieldType: DMMF.Field['type'],
): asserts fieldType is string {
    assert.equal(typeof fieldType, 'string')
}
