# postgraphile-wrap-resolver-reproduce

Start with

```bash
npm run watch
```

go to `localhost:3000/graphiql`

Insert a testobj

```graphql
mutation{
  createTest(input:{test:{}}) {
    test{
      updatedAt
      now
    }
  }
}
```

Query the testobjects

```graphql
{
  allTests {
    nodes {
      updatedAt
      now
    }
  }
}
```

The returned data should return the same timestamps, but returns the "old" one for `updatedAt`:

```graphql
{
  "data": {
    "allTests": {
      "nodes": [
        {
          "updatedAt": "2021-03-06T20:38:53.667086+00:00",
          "now": "2021-03-06T20:49:57.266Z"
        }
      ]
    }
  }
}
```

Running it a second time returns the timestamp inserted from the previous request for `updatedAt`:

```graphql
{
  "data": {
    "allTests": {
      "nodes": [
        {
          "updatedAt": "2021-03-06T20:49:57.262678+00:00",
          "now": "2021-03-06T20:50:48.231Z"
        }
      ]
    }
  }
}
```
