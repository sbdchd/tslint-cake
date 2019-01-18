# tslint-cake [![CircleCI](https://circleci.com/gh/sbdchd/tslint-cake.svg?style=svg)](https://circleci.com/gh/sbdchd/tslint-cake)

> TSLint rules for sweet code

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

```
yarn build

yarn test

yarn lint

yarn fmt
```

## TODO

- add fixers
