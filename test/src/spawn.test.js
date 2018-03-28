var expect = require('chai').expect;
var debugFabAPI = require('../..');

var origDebug = debugFabAPI();
origDebug.save('root*');
origDebug.enable(origDebug.load());

var debug = debugFabAPI.spawnable('root', origDebug);

describe('spawn', function() {
  describe('namespaces are unique', function() {
    it('1 off', function() {
      var child = debug.spawn('child1');
      expect(child.namespace).to.not.eql(debug.namespace);
      expect(debug.namespace).to.eql('root');
      expect(child.namespace).to.eql('root:child1');
    });

    it('2 off', function() {
      var child1 = debug.spawn('child1');
      var child2 = debug.spawn('child2');

      expect(child1).to.not.eql(child2);
      expect(child1.namespace).to.not.eql(child2.namespace);
      expect(child1.namespace).to.eql('root:child1');
      expect(child2.namespace).to.eql('root:child2');
    });

    it('grandchildren', function() {
      var child1 = debug.spawn('child1').spawn('grand');
      var child2 = debug.spawn('child2').spawn('grand');

      expect(child1).to.not.eql(child2); // resolved by noop scope level to be new on each spawn
      expect(child1.namespace).to.not.eql(child2.namespace);
      // resolved by not memoizeing spawn as `grand`
      // above matches for both child1 and child2 and memoizee has child1 cached
      expect(child1.namespace).to.eql('root:child1:grand');
      expect(child2.namespace).to.eql('root:child2:grand');
    });

    it('grandchildren', function() {
      var child1 = debug.spawn('child1').spawn('grand');
      var child2 = debug.spawn('child2').spawn('grand1');

      expect(child1).to.not.eql(child2);
      expect(child1.namespace).to.not.eql(child2.namespace);
      // resolved by not memoizeing spawn as `grand`
      // above matches for both child1 and child2 and memoizee has child1 cached
      expect(child1.namespace).to.eql('root:child1:grand');
      expect(child2.namespace).to.eql('root:child2:grand1');
    });

    it('great grandchildren', function() {
      var child1 = debug.spawn('child1').spawn('grand').spawn('great');
      var child2 = debug.spawn('child2').spawn('grand').spawn('great');;

      expect(child1).to.not.eql(child2);
      expect(child1.namespace).to.not.eql(child2.namespace);
      expect(child1.namespace).to.eql('root:child1:grand:great');
      expect(child2.namespace).to.eql('root:child2:grand:great');
    });
  });
});
