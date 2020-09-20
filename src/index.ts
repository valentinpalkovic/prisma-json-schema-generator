import { generatorHandler } from '@prisma/generator-helper'
import transformDMMF from './generator/transformDMMF'
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
        // const dmmf = transformDMMF(options.dmmf)
        if (options.generator.output) {
            try {
                await fs.promises.mkdir(options.generator.output, {
                    recursive: true,
                })
                await fs.promises.mkdir(
                    path.join(options.generator.output, 'styles'),
                    {
                        recursive: true,
                    },
                )

                // TODO Write JSON Schema file
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
