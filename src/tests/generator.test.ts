import { getDMMF } from '@prisma/sdk'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { transformDMMF } from '../generator/transformDMMF'

const datamodel = /* Prisma */ `
	datasource db {
		provider = "postgresql"
		url      = env("DATABASE_URL")
	}

	model User {
		id                  Int      @id @default(autoincrement())
		createdAt           DateTime @default(now())
		email               String   @unique
        number              BigInt   @default(34534535435353)
        favouriteDecimal    Decimal
        bytes               Bytes
		weight              Float?
		is18                Boolean?
		name                String?
		successorId         Int?
		successor           User?    @relation("BlogOwnerHistory", fields: [successorId], references: [id])
		predecessor         User?    @relation("BlogOwnerHistory")
		role                Role     @default(USER)
		posts               Post[]
        keywords            String[]
        biography           Json
	}

	model Post {
		id     Int   @id @default(autoincrement())
		user   User? @relation(fields: [userId], references: [id])
		userId Int?
	}

	enum Role {
		USER
		ADMIN
	}
`

describe('JSON Schema Generator', () => {
    it('returns JSON Schema for given models', async () => {
        const dmmf = await getDMMF({ datamodel })
        expect(transformDMMF(dmmf)).toEqual({
            $id: 'prisma-json-schema',
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
                Post: {
                    properties: {
                        id: { type: 'integer' },
                        user: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                    },
                    type: 'object',
                },
                User: {
                    properties: {
                        biography: { type: 'object' },
                        createdAt: { format: 'date-time', type: 'string' },
                        email: { type: 'string' },
                        number: { type: 'integer' },
                        bytes: { type: 'string' },
                        favouriteDecimal: { type: 'number' },
                        id: { type: 'integer' },
                        is18: { type: ['boolean', 'null'] },
                        keywords: { items: { type: 'string' }, type: 'array' },
                        name: { type: ['string', 'null'] },
                        posts: {
                            items: { $ref: 'prisma-json-schema#/definitions/Post' },
                            type: 'array',
                        },
                        predecessor: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                        role: { enum: ['USER', 'ADMIN'], type: 'string' },
                        successor: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                        weight: { type: ['number', 'null'] },
                    },
                    type: 'object',
                },
            },
            properties: {
                post: { $ref: 'prisma-json-schema#/definitions/Post' },
                user: { $ref: 'prisma-json-schema#/definitions/User' },
            },
            type: 'object',
        })
    })

    it('keeps relation scalar fields if requested', async () => {
        const dmmf = await getDMMF({ datamodel })
        expect(
            transformDMMF(dmmf, { keepRelationScalarFields: 'true' }),
        ).toEqual({
            $id: 'prisma-json-schema',
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
                Post: {
                    properties: {
                        id: { type: 'integer' },
                        user: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                        userId: {
                            type: ['integer', 'null'],
                        },
                    },
                    type: 'object',
                },
                User: {
                    properties: {
                        biography: { type: 'object' },
                        createdAt: { format: 'date-time', type: 'string' },
                        email: { type: 'string' },
                        number: { type: 'integer' },
                        bytes: { type: 'string' },
                        favouriteDecimal: { type: 'number' },
                        id: { type: 'integer' },
                        is18: { type: ['boolean', 'null'] },
                        keywords: {
                            items: { type: 'string' },
                            type: 'array',
                        },
                        name: { type: ['string', 'null'] },
                        posts: {
                            items: { $ref: 'prisma-json-schema#/definitions/Post' },
                            type: 'array',
                        },
                        predecessor: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                        role: { enum: ['USER', 'ADMIN'], type: 'string' },
                        successor: {
                            anyOf: [
                                { $ref: 'prisma-json-schema#/definitions/User' },
                                { type: 'null' },
                            ],
                        },
                        successorId: {
                            type: ['integer', 'null'],
                        },
                        weight: { type: ['number', 'null'] },
                    },
                    type: 'object',
                },
            },
            properties: {
                post: { $ref: 'prisma-json-schema#/definitions/Post' },
                user: { $ref: 'prisma-json-schema#/definitions/User' },
            },
            type: 'object',
        })
    })

    // eslint-disable-next-line jest/expect-expect
    it('generated schema validates against input', async () => {
        const dmmf = await getDMMF({ datamodel })
        const jsonSchema = transformDMMF(dmmf)
        const ajv = new Ajv()
        addFormats(ajv)
        const validate = ajv.compile(jsonSchema)
        const valid = validate({
            post: {
                id: 0,
                user: {
                    id: 100,
                },
            },
            user: {
                id: 10,
                createdAt: '1997-07-16T19:20:30.45+01:00',
                email: 'jan@scharnow.city',
                biography: {
                    bornIn: 'Scharnow',
                },
                number: 34534535435353,
                bytes: 'SGVsbG8gd29ybGQ=',
                favouriteDecimal: 22.32,
                is18: true,
                keywords: ['prisma2', 'json-schema', 'generator'],
                name: null,
                posts: [
                    {
                        id: 4,
                    },
                    {
                        id: 20,
                    },
                ],
                predecessor: {
                    id: 10,
                    email: 'horst@wassermann.de',
                },
                successor: null,
                role: 'USER',
                weight: 10.12,
            },
        })

        if (!valid) {
            throw new Error(ajv.errorsText(validate.errors))
        }
    })
})
