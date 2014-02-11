TESTS=$(shell find test -name *.test.js)

test:
	@browserify lib/browser.js -s Should --dg false -o should.js.for-tests
	@./node_modules/.bin/mocha --ui exports --recursive $(TESTS)

browser:
	@browserify lib/browser.js -s Should --dg false -o should.js

.PHONY: test browser