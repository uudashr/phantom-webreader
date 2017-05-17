# Phantom WebReader

This is attemt to create simple server using [PhantomJS](http://phantomjs.org/) and serve the web reading using [Readability](https://github.com/mozilla/readability).

Run the server
```shell
$ phantomjs server.js 8080
```

Test using [HTTPie](https://httpie.org/)
```shell
$ http localhost:8080 url==https://www.techinasia.com/talk/dbs-ceo-banks-digital-reinvention
```

or curl

```shell
$ curl http://localhost:8080?url=https://www.techinasia.com/talk/dbs-ceo-banks-digital-reinvention
```
