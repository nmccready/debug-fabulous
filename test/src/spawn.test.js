const debugFabAPI = require('../../src');

const origDebug = debugFabAPI();
origDebug.save('root*');
origDebug.enable(origDebug.load());

const debug = debugFabAPI.spawnable('root', origDebug);

describe('spawn', () => {
  describe('namespaces same level identical', () => {
    it('2 off', () => {
      const child1 = debug.spawn('child1');
      const child2 = debug.spawn('child1');

      expect(child1).toEqual(child2);
      expect(child1.namespace).toEqual(child2.namespace);
      expect(child1.namespace).toEqual('root:child1');
    });

    it('grandchildren', () => {
      const child1 = debug.spawn('child1').spawn('grand');
      const child2 = debug.spawn('child1').spawn('grand');

      expect(child1).toEqual(child2);
      expect(child1.namespace).toEqual(child2.namespace);
      expect(child1.namespace).toEqual('root:child1:grand');
    });

    it('great', () => {
      const child1 = debug
        .spawn('child1')
        .spawn('grand')
        .spawn('great');
      const child2 = debug
        .spawn('child1')
        .spawn('grand')
        .spawn('great');

      expect(child1).toEqual(child2);
      expect(child1.namespace).toEqual(child2.namespace);
      expect(child1.namespace).toEqual('root:child1:grand:great');
    });
  });
  describe('namespaces are unique', () => {
    it('1 off', () => {
      const child = debug.spawn('child1');
      expect(child.namespace).not.toEqual(debug.namespace);
      expect(debug.namespace).toEqual('root');
      expect(child.namespace).toEqual('root:child1');
    });

    it('2 off', () => {
      const child1 = debug.spawn('child1');
      const child2 = debug.spawn('child2');

      expect(child1).not.toEqual(child2);
      expect(child1.namespace).not.toEqual(child2.namespace);
      expect(child1.namespace).toEqual('root:child1');
      expect(child2.namespace).toEqual('root:child2');
    });

    it('grandchildren', () => {
      const child1 = debug.spawn('child1').spawn('grand');
      const child2 = debug.spawn('child2').spawn('grand');

      // resolved by noop scope level to be new on each spawn
      expect(child1).not.toEqual(child2);
      expect(child1.namespace).not.toEqual(child2.namespace);
      // resolved by not memoizeing spawn as `grand`
      // above matches for both child1 and child2 and memoizee has child1 cached
      expect(child1.namespace).toEqual('root:child1:grand');
      expect(child2.namespace).toEqual('root:child2:grand');
    });

    it('grandchildren', () => {
      const child1 = debug.spawn('child1').spawn('grand');
      const child2 = debug.spawn('child2').spawn('grand1');

      expect(child1).not.toEqual(child2);
      expect(child1.namespace).not.toEqual(child2.namespace);
      // resolved by not memoizeing spawn as `grand`
      // above matches for both child1 and child2 and memoizee has child1 cached
      expect(child1.namespace).toEqual('root:child1:grand');
      expect(child2.namespace).toEqual('root:child2:grand1');
    });

    it('great grandchildren', () => {
      const child1 = debug
        .spawn('child1')
        .spawn('grand')
        .spawn('great');
      const child2 = debug
        .spawn('child2')
        .spawn('grand')
        .spawn('great');

      expect(child1).not.toEqual(child2);
      expect(child1.namespace).not.toEqual(child2.namespace);
      expect(child1.namespace).toEqual('root:child1:grand:great');
      expect(child2.namespace).toEqual('root:child2:grand:great');
    });
  });
});
