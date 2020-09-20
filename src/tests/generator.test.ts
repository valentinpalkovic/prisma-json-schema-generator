import { getDMMF } from '@prisma/sdk'
import { transformDMMF } from '../generator/transformDMMF'

const datamodel = /* Prisma */ `
	model User {
		id        Int      @id @default(autoincrement())
		createdAt DateTime @default(now())
		email     String   @unique
		name      String?
		posts     Post[]
	}

	model Post {
		id     Int   @id @default(autoincrement())
		User   User? @relation(fields: [userId], references: [id])
		userId Int?
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
                        User: { type: 'object' },
                        id: { type: 'integer' },
                        userId: { type: 'integer' },
                    },
                    required: ['id'],
                    type: 'object',
                },
                User: {
                    properties: {
                        createdAt: { format: 'date-time', type: 'string' },
                        email: { type: 'string' },
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        posts: { type: 'array' },
                    },
                    required: ['id', 'createdAt', 'email'],
                    type: 'object',
                },
            },
        })
    })
})
