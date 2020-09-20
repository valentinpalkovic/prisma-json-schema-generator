import { getDMMF } from '@prisma/sdk'
import { transformDMMF } from '../generator/transformDMMF'
import util from 'util'

const datamodel = /* Prisma */ `
	model User {
		id        Int      @id @default(autoincrement())
		// createdAt DateTime @default(now())
		// email     String   @unique
		// name      String?
		// posts     Post[]
	}

	// model Post {
	// 	id     Int   @id @default(autoincrement())
	// 	User   User? @relation(fields: [userId], references: [id])
	// 	userId Int?
	// }
`

describe('TOC', () => {
    it('renders TOC Subheader correctly', async () => {
        const dmmf = await getDMMF({ datamodel })
        console.log(util.inspect(dmmf, { showHidden: false, depth: null }))
    })
})
