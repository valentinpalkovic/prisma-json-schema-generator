import { getDMMF } from '@prisma/sdk'
import { transformDMMF } from '../generator/transformDMMF'

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
                    required: ['id'],
                    type: 'object',
                },
                User: {
                    properties: {
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
                    required: ['id', 'createdAt', 'email', 'role'],
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
})
