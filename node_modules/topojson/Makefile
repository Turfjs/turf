GENERATED_FILES = \
	bower.json \
	package.json \
	topojson.min.js \
	examples/us-10m.json \
	examples/world-50m.json \
	examples/world-110m.json \
	node_modules/us-atlas/topo/us-10m.json \
	node_modules/world-atlas/topo/world-50m.json \
	node_modules/world-atlas/topo/world-110m.json

.SECONDARY:

.PHONY: all clean test

all: $(GENERATED_FILES)

bower.json: bin/bower topojson.js
	@rm -f $@
	bin/bower > $@
	@chmod a-w $@

package.json: bin/package topojson.js
	@rm -f $@
	bin/package > $@
	@chmod a-w $@

topojson.min.js: topojson.js
	node_modules/.bin/uglifyjs $^ -c -m -o $@

examples/us-%.json: node_modules/us-atlas/topo/us-%.json
	cp $< $@

examples/world-%.json: node_modules/world-atlas/topo/world-%.json
	cp $< $@

node_modules/us-atlas/topo/%.json:
	make topo/$(notdir $@) -C node_modules/us-atlas

node_modules/world-atlas/topo/%.json:
	make topo/$(notdir $@) -C node_modules/world-atlas

test: all
	@npm test

clean:
	rm -f -- $(GENERATED_FILES)
