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
    "react-prefer-simple-fragment": true
    // ...
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

### `no-template-string-cast`

Prefer `String()` or `.toString()` to cast as a string instead of `` `${}` ``.

### `no-pointless-case-scope`

Remove unnecessary scopes in `switch` statement `case`s when the only child
expression is a `return` statement.

E.g.,

```typescript
switch (foo) {
  case bar: {
    return "foo"
  }
}
// can become
switch (foo) {
  case bar:
    return "foo"
}
```

### `no-name-never`

Using a variable `name` with type `never` is likely a mistake.

`name` is defined globally if you include `--lib dom`.

see: <https://github.com/Microsoft/TypeScript/blob/3a2f6a3ed1a598a241e7c750873105f22e7a2463/lib/lib.dom.d.ts#L17405>

### `improper-map-prefer-foreach`

Prefer `forEach` instead of `map` when the result isn't used

```typescript
foo.map(x => {
  x.id = 10
})

// should be

foo.forEach(x => {
  x.id = 10
})
```

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
