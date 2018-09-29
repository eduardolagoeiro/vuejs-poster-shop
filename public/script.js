new Vue({
  el: '#app',
  data:{
    total: 0,
    items: [
      {title: 'Item 1', value: 1.01},
      {title: 'Item 2', value: 2.02},
      {title: 'Item 3', value: 3.03}
    ],
    cart: new Map()
  },
  methods:{
    addItem: function(index){
      var itemDetail = this.cart.get(this.items[index]);
      if(itemDetail){
        incrementBy(itemDetail, 1, this.items[index].value);
        setItemInCart(this.cart, this.items[index], itemDetail, this);
      }else{
        setItemInCart(this.cart, this.items[index], {
          times: 1,
          value: this.items[index].value
        }, this);
      }
    },
    incrementItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, 1, item.value);
      setItemInCart(this.cart, item, itemDetail, this);
    },
    decrementItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, -1, item.value);
      setItemInCart(this.cart, item, itemDetail, this);
    },
    removeItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, -1*itemDetail.times, item.value);
      setItemInCart(this.cart, item, itemDetail, this);
    }
  },
  filters: {
    currency: function(price){
      return '$'.concat(price.toFixed(2));
    }
  }
});

function incrementBy(itemDetail, num, value){
  itemDetail.times += num;
  itemDetail.value += value * num;
}

function setItemInCart(cart, item, itemDetail, ctx){
  if(itemDetail.times == 0){
    cart.delete(item);
  }else{
    cart.set(item, itemDetail);
  }
  ctx.total = 0;
  for( var [key, value] of cart){
    ctx.total += value.value;
  }
  ctx.$forceUpdate();
}
