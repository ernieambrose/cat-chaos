import Cat from './Cat.js';

export default class CatMittens extends Cat {
  constructor(scene, x, y) {
    super(scene, x, y, 'mittens');
  }
}
