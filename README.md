[![Actions Status](https://github.com/valentinpalkovic/prisma-json-schema-generator/workflows/build/badge.svg)](https://github.com/valentinpalkovic/prisma-json-schema-generator/actions)
[![Code QL](https://github.com/valentinpalkovic/prisma-json-schema-generator/workflows/CodeQL/badge.svg)](https://github.com/valentinpalkovic/prisma-json-schema-generator/workflows/CodeQL/badge.svg)
[![npm](https://img.shields.io/npm/v/prisma-json-schema-generator)](https://www.npmjs.com/package/prisma-json-schema-generator)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/valentinpalkovic/prisma-json-schema-generator/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)

# Prisma JSON Schema Generator

A generator, which takes a Prisma 2 `schema.prisma` and generates a JSON Schema in version 7 of the specification (https://json-schema.org/).

## Getting Started

**1. Install**

npm:

```shell
npm install prisma-json-schema-generator --save-dev
```

yarn:

```shell
yarn add -D prisma-json-schema-generator
```

**2. Add the generator to the schema**

```prisma
generator jsonSchema {
  provider = "prisma-json-schema-generator"
}
```

With a custom output path (default=./json-schema)

```prisma
generator jsonSchema {
  provider = "prisma-json-schema-generator"
  output = "custom-output-path"
}
```

Additional options

```prisma
generator jsonSchema {
  provider = "prisma-json-schema-generator"
  keepRelationScalarFields = "true"
  schemaId = "some-schema-id"
}
```

The generator currently supports a single option

| Key                      | Default Value | Description                                                                                                                                                                                            |
| ------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| keepRelationScalarFields | "false"       | By default, the JSON Schema that's generated will output only objects for related model records. If set to "true", this will cause the generator to also output foreign key fields for related records |
| schemaId                 | undefined     | Add an id to the generated schema. All references will include the schema id                                                                                                                           |

**3. Run generation**

prisma:

```shell
prisma generate
```

nexus with prisma plugin:

```shell
nexus build
```

## Supported Node Versions

|         Node Version | Support            |
| -------------------: | :----------------- |
| (Maintenance LTS) 12 | :heavy_check_mark: |
| (Maintenance LTS) 14 | :heavy_check_mark: |
|          (Active) 16 | :heavy_check_mark: |
|         (Current) 17 | :heavy_check_mark: |

## Examples

This generator converts a prisma schema like this:

```prisma
datasource db {
	provider = "postgresql"
	url      = env("DATABASE_URL")
}

model User {
    id                  Int      @id @default(autoincrement())
    createdAt           DateTime @default(now())
    email               String   @unique
    weight              Float?
    is18                Boolean?
    name                String?
    number              BigInt   @default(34534535435353)
    favouriteDecimal    Decimal
    bytes               Bytes
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
```

into:

```javascript
{
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        Post: {
            properties: {
                id: { type: 'integer' },
                user: {
                    anyOf: [
                        { $ref: '#/definitions/User' },
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
                id: { type: 'integer' },
                is18: { type: ['boolean', 'null'] },
                keywords: { items: { type: 'string' }, type: 'array' },
                name: { type: ['string', 'null'] },
                number: { type: 'integer', default: '34534535435353' },
                bytes: { type: 'string' },
                favouriteDecimal: { type: 'number' },
                posts: {
                    items: { $ref: '#/definitions/Post' },
                    type: 'array',
                },
                predecessor: {
                    anyOf: [
                        { $ref: '#/definitions/User' },
                        { type: 'null' },
                    ],
                },
                role: { enum: ['USER', 'ADMIN'], type: 'string', default: 'USER' },
                successor: {
                    anyOf: [
                        { $ref: '#/definitions/User' },
                        { type: 'null' },
                    ],
                },
                weight: { type: ['integer', 'null'] },
            },
            type: 'object',
        },
    },
    properties: {
        post: { $ref: '#/definitions/Post' },
        user: { $ref: '#/definitions/User' },
    },
    type: 'object',
}
```

So the following input will correctly be validated:

```javascript
{
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
        weight: 10.14,
    },
}
```

## License: MIT

Copyright (c) 2020 Valentin Palkovič

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
