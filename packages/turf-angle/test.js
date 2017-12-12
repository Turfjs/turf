import test from 'tape'
import { round } from '@turf/helpers'
import angle from './'

test('get-angle', t => {
  t.equal(round(angle([5, 5], [5, 6], [3, 4])), 45, '45 degrees')
  t.end()
})

test('test-angle -- issues', t => {
  const start = [167.72709868848324, -45.56543836343071]
  const mid = [167.7269698586315, -45.56691059720167]
  const end = [167.72687866352499, -45.566989345276355]
  const angle = angle(start, mid, end)

  t.false(isNaN(angle), 'result is not NaN')
  t.end()
})