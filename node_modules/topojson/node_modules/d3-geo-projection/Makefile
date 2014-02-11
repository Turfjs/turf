GENERATED_FILES = \
	d3.geo.projection.js \
	d3.geo.projection.min.js

all: $(GENERATED_FILES)

.PHONY: clean all test

d3.geo.projection.js: $(shell node_modules/.bin/smash --list src/index.js)
	@rm -f $@
	node_modules/.bin/smash src/index.js | node_modules/.bin/uglifyjs - -b indent-level=2 -o $@
	@chmod a-w $@

d3.geo.projection.min.js: d3.geo.projection.js
	@rm -f $@
	node_modules/.bin/uglifyjs $< -c -m -o $@

test:
	@node_modules/.bin/vows

clean:
	rm -f -- $(GENERATED_FILES)
