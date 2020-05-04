
// ------------ Game Engine Snapshot Tests ---------------- //

describe('Game Engine Snapshot Tests', () => {
  test('Denormalization', () => {
    expect({}).toMatchSnapshot();
  });
});
