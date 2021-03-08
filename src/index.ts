import { generatorHandler } from '@prisma/generator-helper'
import { transformDMMF } from './generator/transformDMMF'
import * as fs from 'fs'
import * as path from 'path'

generatorHandler({
    onManifest() {
        return {
            defaultOutput: './json-schema',
            prettyName: 'Prisma JSON Schema Generator',
        }
    },
    async onGenerate(options) {
        const jsonSchema = transformDMMF(options.dmmf, options.generator.config)
        if (options.generator.output) {
            try {
                await fs.promises.mkdir(options.generator.output, {
                    recursive: true,
                })
                await fs.promises.writeFile(
                    path.join(
                        options.generator.output,
                        options.generator.config.filename ?? 'json-schema.json',
                    ),
                    JSON.stringify(jsonSchema, null, 2),
                )
            } catch (e) {
                console.error(
                    'Error: unable to write files for Prisma Schema Generator',
                )
                throw e
            }
        } else {
            throw new Error(
                'No output was specified for Prisma Schema Generator',
            )
        }
    },
})
