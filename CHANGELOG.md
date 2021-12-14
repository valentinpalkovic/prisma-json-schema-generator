# [1.6.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.5.0...v1.6.0) (2021-12-14)


### Features

* Generate default value in JSON Schema ([ddf4fa0](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/ddf4fa0802cf14dbe450001eeedf846746419f7d))

# [1.5.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.4.0...v1.5.0) (2021-09-26)


### Features

* add schema id option ([1d9ac04](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/1d9ac043de528d3ecabc8db3cc2a66d4d6449401)), closes [#73](https://github.com/valentinpalkovic/prisma-json-schema-generator/issues/73)

# [1.4.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.3.0...v1.4.0) (2021-08-03)


### Features

* Added support for new Prisma (2.17) types Decimal, Bytes and BigInt ([c2ecc7e](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/c2ecc7ed2922e0ef919f9f2c40f37c283ad3adaa)), closes [#37](https://github.com/valentinpalkovic/prisma-json-schema-generator/issues/37)

# [1.3.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.2.2...v1.3.0) (2021-05-28)


### Features

* add option to keep relation scalar fields in json schema output ([8162e70](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/8162e70c45ec1aaaebb4c7500fc7ec565f001e34))

## [1.2.2](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.2.1...v1.2.2) (2021-04-04)


### Bug Fixes

* Add support for prisma ^2.20 ([3a6ba14](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/3a6ba14246d233a41a4e118241860422b4c91b00)), closes [#26](https://github.com/valentinpalkovic/prisma-json-schema-generator/issues/26)

## [1.2.1](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.2.0...v1.2.1) (2021-01-20)


### Bug Fixes

* **deps:** Use newest prisma v2.15.0 helpers and sdk ([db4a38d](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/db4a38df744fae557b476a40c67ff7edfa928ac9))

# [1.2.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.1.4...v1.2.0) (2020-11-17)


### Features

* **chor:** add bin executable ([9e30dff](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/9e30dff5e218f86fffaa5d0fe18ae076d9f043ea))

## [1.1.4](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.1.3...v1.1.4) (2020-10-19)


### Bug Fixes

* Support floating number use cases ([7f11bdd](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/7f11bddbbe019b9d6d350d7116e473b88d518c10)), closes [#7](https://github.com/valentinpalkovic/prisma-json-schema-generator/issues/7)

## [1.1.3](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.1.2...v1.1.3) (2020-09-26)


### Bug Fixes

* remove bin cli reference from package json ([f0f0a06](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f0f0a066c0882b814774490d7e0c1ab265bf7397)), closes [#6](https://github.com/valentinpalkovic/prisma-json-schema-generator/issues/6)

## [1.1.2](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.1.1...v1.1.2) (2020-09-24)


### Bug Fixes

* include correct assets for a github release ([8f12f67](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/8f12f6711e5af64b269b3fc3717d5bf6fc75d940))

## [1.1.1](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.1.0...v1.1.1) (2020-09-24)


### Bug Fixes

* configure semantic-release/github and configure tarball include correctly ([55adfcb](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/55adfcbbee5ac610fff7f102d5ea63dd0216e398))

# [1.1.0](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.0.0...v1.1.0) (2020-09-24)


### Features

* support nullable primitives and relations ([0f8de59](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/0f8de59df785446f138b9cefbe9458916663c7b5))

# 1.0.0 (2020-09-23)


### Bug Fixes

* fix schema for single references (not array) ([0e3f1c8](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/0e3f1c84cf408b33f833d3d7520819bc5d603656))
* formatting of Readme ([5d5a362](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/5d5a3623062dd146e1f23058df03af8708dd972d))
* move core-js dev-dependency to dependencies ([0b9fdb1](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/0b9fdb1ca5372344dc48b42ab0512ffaa0df8642))
* only run ci on pull-request ([f4cc6d8](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f4cc6d888a099ca0ff07488ba07719d3bbe6ee60))
* only run tests on source files ([a729895](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/a7298955831f9bf9544363e43282f393829ff978))
* remove files from npm package ([3703cbe](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/3703cbe7348e6506dd61deeaad94b5629e39f8b3))
* Remove required attribute ([b74115f](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/b74115f894ab834024276d5e9f756675c5f0338c))
* Trigger release ([2a4974b](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/2a4974beeb0690edda190054d4892ee2a6d7717f))


### Features

* add 'properties' field to json-schema ([f71a13a](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f71a13a73a038dfebbfffdaf278d27962c36e264))
* add a one-to-one self reference example ([a9dc0de](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/a9dc0dea69e27442004aab9cb87e9d9d1c79edc8))
* add babel to compilation step ([8b03db2](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/8b03db26eb45b2d54df26500ffe15dca36019576))
* add enum support ([d2dfb96](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/d2dfb9640f93be87e4437a6ddd95ddc821e4c7a2))
* add Json field to example ([bbe171a](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/bbe171a65ad48533d4caf906c632d2f72859d57a))
* implement dmmf to json schema mapping ([f240a70](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f240a701116fc068c7ac7df57bfee0f272c11ba5))
* remove relational scalar types and support scalar lists ([2e12c10](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/2e12c102f780227bbafc45a0f9b373140701226c))
* support model references ([25077d6](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/25077d692b805961c01178e28ceb1207c3c5736a))

# [1.0.0-beta.3](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-09-23)


### Bug Fixes

* remove files from npm package ([3703cbe](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/3703cbe7348e6506dd61deeaad94b5629e39f8b3))

# [1.0.0-beta.2](https://github.com/valentinpalkovic/prisma-json-schema-generator/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-09-23)


### Bug Fixes

* Trigger release ([2a4974b](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/2a4974beeb0690edda190054d4892ee2a6d7717f))

# 1.0.0-beta.1 (2020-09-23)


### Bug Fixes

* fix schema for single references (not array) ([0e3f1c8](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/0e3f1c84cf408b33f833d3d7520819bc5d603656))
* formatting of Readme ([5d5a362](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/5d5a3623062dd146e1f23058df03af8708dd972d))
* move core-js dev-dependency to dependencies ([0b9fdb1](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/0b9fdb1ca5372344dc48b42ab0512ffaa0df8642))
* only run ci on pull-request ([f4cc6d8](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f4cc6d888a099ca0ff07488ba07719d3bbe6ee60))
* only run tests on source files ([a729895](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/a7298955831f9bf9544363e43282f393829ff978))
* Remove required attribute ([b74115f](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/b74115f894ab834024276d5e9f756675c5f0338c))


### Features

* add 'properties' field to json-schema ([f71a13a](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f71a13a73a038dfebbfffdaf278d27962c36e264))
* add a one-to-one self reference example ([a9dc0de](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/a9dc0dea69e27442004aab9cb87e9d9d1c79edc8))
* add babel to compilation step ([8b03db2](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/8b03db26eb45b2d54df26500ffe15dca36019576))
* add enum support ([d2dfb96](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/d2dfb9640f93be87e4437a6ddd95ddc821e4c7a2))
* add Json field to example ([bbe171a](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/bbe171a65ad48533d4caf906c632d2f72859d57a))
* implement dmmf to json schema mapping ([f240a70](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/f240a701116fc068c7ac7df57bfee0f272c11ba5))
* remove relational scalar types and support scalar lists ([2e12c10](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/2e12c102f780227bbafc45a0f9b373140701226c))
* support model references ([25077d6](https://github.com/valentinpalkovic/prisma-json-schema-generator/commit/25077d692b805961c01178e28ceb1207c3c5736a))
