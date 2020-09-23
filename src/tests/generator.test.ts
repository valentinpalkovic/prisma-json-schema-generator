import { getDMMF } from '@prisma/sdk'
import { transformDMMF } from '../generator/transformDMMF'
import Ajv from 'ajv'

const datamodel = /* Prisma */ `
	datasource db {
		provider = "postgresql"
		url      = env("DATABASE_URL")
	}

	model User {
		id          Int      @id @default(autoincrement())
		createdAt   DateTime @default(now())
		email       String   @unique
		weight      Float?
		is18        Boolean?
		name        String?
		successorId Int?
		successor   User?    @relation("BlogOwnerHistory", fields: [successorId], references: [id])
		predecessor User?    @relation("BlogOwnerHistory")
		role        Role     @default(USER)
		posts       Post[]
        keywords    String[]
        biography   Json
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
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
                Post: {
                    properties: {
                        id: { type: 'integer' },
                        user: { $ref: '#/definitions/User' },
                    },
                    type: 'object',
                },
                User: {
                    properties: {
                        biography: { type: 'object' },
                        createdAt: { format: 'date-time', type: 'string' },
                        email: { type: 'string' },
                        id: { type: 'integer' },
                        is18: { type: 'boolean' },
                        keywords: { items: { type: 'string' }, type: 'array' },
                        name: { type: 'string' },
                        posts: {
                            items: { $ref: '#/definitions/Post' },
                            type: 'array',
                        },
                        predecessor: { $ref: '#/definitions/User' },
                        role: { enum: ['USER', 'ADMIN'], type: 'string' },
                        successor: { $ref: '#/definitions/User' },
                        weight: { type: 'integer' },
                    },
                    type: 'object',
                },
            },
            type: 'object',
            properties: {
                user: { $ref: '#/definitions/User' },
                post: { $ref: '#/definitions/Post' },
            },
        })
    })

    // eslint-disable-next-line jest/expect-expect
    it('generated schema validates against input', async () => {
        const dmmf = await getDMMF({ datamodel })
        const jsonSchema = transformDMMF(dmmf)
        const ajv = new Ajv()
        const validate = ajv.compile(jsonSchema)
        const valid = validate({
            post: {
                id: 0,
                user: {
                    id: 3,
                    weight: 10,
                },
            },
            user: {
                id: 10,
                createdAt: '1997-07-16T19:20:30.45+01:00',
                email: 'jan@scharnow.city',
                biography: {
                    bornIn: 'Scharnow',
                },
                is18: true,
                keywords: ['prisma2', 'json-schema', 'generator'],
                name: 'Jan Uwe',
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
                successor: {
                    id: 12,
                    name: 'Niels Emmerich',
                },
                role: 'USER',
                weight: 10,
            },
        })

        if (!valid) {
            throw new Error(ajv.errorsText(validate.errors))
        }
    })
})
