const sv = window['sultana-validator']

describe('sultana-validator', () => {
  it('should have sultana-validator', () => {
    if (sv() !== 'helloworld') {
      throw new Error('sultana-validator not found')
    }
  })
})
