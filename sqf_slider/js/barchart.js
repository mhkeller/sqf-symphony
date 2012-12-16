(function(exports) {

// Collections you wanna dance with
// ------------

function htmlId(obj) {
  return obj._id.split('/').join('_');
}

// console.log(htmlId("/tpye/foo"));

var collections = {
  "items": {
    enter: function(items) {
      items.each(function(item) {

        var bar = $('<div class="bar" id="'+htmlId(item)+'"><div class="label">'+item._id+'</div><div class="value">'+item.pos.dy+'</div></div>')
                     .css('left', item.pos.x)
                     .css('bottom', 0)
                     .css('width', item.pos.dx)
                     .css('height', 0);
        $('#canvas').append(bar);
      });

      // Delegate to update (motion tweening fun)
      _.delay(this.collections["items"].update, 200, items);
    },

    update: function(items) {
      items.each(function(item) {
        var cell = $('#'+htmlId(item))
                     .css('left', item.pos.x)
                     .css('width', item.pos.dx)
                     .css('height', item.pos.dy)
                     .find('.value').html(item.pos.dy)
      });
    },

    exit: function(items) {
      items.each(function(i) { $('#'+htmlId(i)).remove() });
    }
  }
};

// Barchart Visualization
// ------------

var Barchart = Dance.Performer.extend({

  collections: collections,

  initialize: function(options) {
    this.data["items"] = options.items;
  },

  layout: function(property) {
    var margin = 50;
    this.data["items"].each(function(item, key, index) {

      item.pos = {
        x: margin+index*50,
        dx: 40,
        dy: item.get(property)
      };
    });
  },

  update: function(items, property) {
    this.data["items"] = items;
    this.layout(property);
    this.refresh();
  }
});

exports.Barchart = Barchart;

})(window);