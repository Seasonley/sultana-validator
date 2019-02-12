describe('sultana-validator', function () {

  it('should have sultana-validator', function () {
    define(['sultana-validator'], function (sv) {
      if (sv() !== 'helloworld') {
        throw new Error('sultana-validator not found')
      }
    });
  })
})