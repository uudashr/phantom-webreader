# Phantom WebReader

This is attempt to create simple server using [PhantomJS](http://phantomjs.org/) and serve the web reading using [Readability](https://github.com/mozilla/readability).

**Why?**
> Some web content loaded using AJAX.

Script injected on PhantomJS, ensure it load the AJAX content.

Run the server
```shell
$ phantomjs server.js 8080
```

Test using [HTTPie](https://httpie.org/)
```shell
$ http localhost:8080 url==https://www.techinasia.com/talk/7-learned-running-hk-accelerator
```

or curl

```shell
$ curl http://localhost:8080?url=https://www.techinasia.com/talk/7-learned-running-hk-accelerator
```
