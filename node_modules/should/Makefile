
test:
	@./node_modules/.bin/mocha \
		--ui exports

browser:
	@browserify lib/should.js -s should --dg false -o should.js

.PHONY: test browser