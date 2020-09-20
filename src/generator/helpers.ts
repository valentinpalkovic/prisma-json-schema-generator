const primitiveTypes = ['String', 'Boolean', 'Int', 'Float', 'Json', 'DateTime']

export function isScalarType(type: string): boolean {
    return primitiveTypes.includes(type)
}
