# tslint-cake [![npm version](https://badge.fury.io/js/tslint-cake.svg)](https://www.npmjs.com/package/tslint-cake) [![CircleCI](https://circleci.com/gh/sbdchd/tslint-cake.svg?style=svg)](https://circleci.com/gh/sbdchd/tslint-cake)

> TSLint rules for sweet code

## Usage

1. Install

```shell
yarn add tslint-cake
```

2. Update `tslint.json`

```json
{
  "extends": ["tslint-cake"],
  "rules": {
    "react-prefer-simple-fragment": true,
    "no-pointless-computed-property-name": true,
    "jsx-no-true-attribute": true
  }
}
```

## Why?

To have a place to add miscellaneous TSLint rules that don't exist in TSLint
or common TSLint libraries.

## Rules

### `no-pointless-computed-property-name`

Use `{ foo: bar }` instead of `{ ["foo"]: bar }`

### `react-prefer-simple-fragment`

Use `<></>` instead of `<React.Fragment><React.Fragment/>`

### `jsx-no-true-attribute`

Use `<Foo bar/>` instead of `<Foo bar={true}/>`

## Dev

```shell
yarn build

yarn test

yarn lint

yarn fmt

yarn publish
```

## TODO

- add fixers
