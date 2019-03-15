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

### `react-prefer-simple-fragment` [Fixer]

Use `<></>` instead of `<React.Fragment><React.Fragment/>`

### `jsx-no-true-attribute` [Fixer]

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

### `no-promise-catch`

Using `.catch()` on a `Promise` usually means that you could better describe
the outputs of the async function using a union or `Result<T, E>` types.

```typescript
declare const getFooAsync: () => Promise<number>

getFooAsync()
  .then(r => console.log(r))
  .catch(e => console.error(e)) // `e` could be anything. We can't type the arg to catch.

// instead we can do the following

declare const getBarAsync: () => Promise<number | Error>

getBarAsync().then(r => {
  if (r instanceof Error) {
    console.error(r)
  } else {
    console.log(r)
  }
})
```

### `object-index-must-return-possibly-undefined`

The values of an index signature of a type are always possibly `undefined`
even though TypeScript won't warn you. This lint forces you to define your
index signature to possibly return `undefined`.

```typescript
interface IFoo {
  [key: string]: number // Error: Value of an object key is possibly undefined.
}

interface IBar {
  [key: string]: number | undefined // ok
}
```

### `exact-object-spread`

This rule is an attempt at gaining some semblence of
[exactness](https://github.com/Microsoft/TypeScript/issues/12936) with object
spread.

Currently, there are cases where TypeScript won't warn about adding extra,
non-existing properties to an object when spreading. This lint fills in some
of those gaps and warns you when adding non-existent properties.

Note, this rule attempts to enforce
[exactness](https://flow.org/en/docs/types/objects/#exact-object-types) on
all spreads and this might not be what you want.

```typescript
interface IState {
  id: number
  name: string
  address: {
    street: string
    state: string
    country: string
  }
}

function update(state: IState): IState {
  return {
    ...state,
    notProp: false // TypeScript error
  }
}

// TypeScript will also warn with nested spreading
function update(state: IState): IState {
  return {
    ...state,
    address: {
      ...state.address,
      notProp: false // TypeScript error
    }
  }
}

// However, if we pull the nested spread out into a variable TypeScript won't
// warn us about extra properties

// no errors with TypeScript
function update(state: IState): IState {
  const address = {
    // TSLint error when we enable this rule
    ...state.address,
    foo: "bar"
  }
  return {
    ...state,
    address
  }
}
```

### `react-memo-requires-custom-compare`

When using [`React.memo()`](https://reactjs.org/docs/react-api.html#reactmemo) or [`extends React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) the default
comparsions are shallow which means they will always render for complex props
like `Date`'s, `Array`s, or `Object`s, even if the underlying values are equivalent.

In the cases of these complex props, this lint will warn you and recommend
passing a custom compare function `React.memo()` or defining a custom
`shouldComponentUpdate` and extending `React.Component`.

**Caveat:** If an object is passed as a prop and isn't copied/changed, i.e., no
`{...x}` then referential integrity is retained and the shallow compare of
`React.memo()` and `PureComponent` will correctly prevent a render. So if you
are using something like
[Immutable-js](https://github.com/immutable-js/immutable-js) where shallow
equals is maintained then this lint might be less helpful.

```typescript
interface IOkayProps {
  name: string
  accountAge: number | string
  admin: boolean
}

const Okay = React.memo((props: IOkayProps) => (
  <p>
    {props.name} ({props.accountAge})
  </p>
))

interface IBadProps {
  user: {
    name: string
  }
}

// TSLint raises error
const Bad = React.memo((props: IBadProps) => <p>{props.user.name} </p>)

// TSLint raises error
class BadPure extends React.PureComponent<IBadProps> {
  render() {
    return <p>{props.user.name} </p>
  }
}
```

### `no-null-to-string`

Checks for cases where `null` or `undefined` are converted to `string` or passed to a jsx expression.

```typescript
const userName: string | null = null
// all of the following error
const foo = `hello ${userName}`
const bar = String(userName)
const Foo = <p>{userName}</p>
const blah = "hello " + userName
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
