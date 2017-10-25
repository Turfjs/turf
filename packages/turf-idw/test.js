import test from 'tape'
import idw from './'

test('idw', t => {
  t.throws(() => idw(), /Module deprecated in favor of @turf\/interpolate/, 'Module deprecated in favor of @turf/interpolate')
  t.end()
})
