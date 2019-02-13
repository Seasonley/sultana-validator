
import sv from '../lib/index'

describe('sultana-validator', () => {
  it('should have sultana-validator', () => {
    if (sv() !== 'helloworld') {
      throw new Error('sultana-validator not found')
    }
  })
})
