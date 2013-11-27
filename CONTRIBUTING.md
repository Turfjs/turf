## Want to Contribute?

Pull requests, feature requests, comments on issues, testing, documentation, or any other type of support is welcome and encouraged. This is a big project, and I appreciate any help I can get. Let's go build a better geospatial engine for the web! Not sure where to start? Shoot me an email at morgan.herlocker [at] gmail.com or [@morganherlocker](https://twitter.com/morganherlocker).

**A few notes before diving in:**

- The focus of the project is on building a core geospatial engine. Vendor specific stuff belongs in a seperate module.
- Geojson is the primary format. Topojson can be used as intermediate format. 
- No pull requests will be accepted that provide only style changes.
- Never add an external dependency unless you absolutely have to. Even then, please ask first, because there may be a work around.
- Do not make calls to web services. 
- Simplicity is the name of the game. Every feature should be a simple file in /lib with a corresponding file in /test. Reference the new module in index.js and you are all set.
- Testing is absolutely required 100% of the time. Look at the existing tests for examples.
- This is a functional library. Ensure that your functions never have side effects.
- **Always create an issue before starting a new feature. This will allow us to discuss how something is being implemented and integrated. Turned down pull requests are no fun for anyone.**

## Development

### Run Tests

```shell
cd test 
mocha .
```

### Build

```shell
sh build
```