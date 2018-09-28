new Vue({
  el: '#app',
  data:{
    total: 0,
    items: [
      {title: 'Item 1', value: 1.01},
      {title: 'Item 2', value: 2.02},
      {title: 'Item 3', value: 3.03}
    ],
    cart: []
  },
  methods:{
    addItem: function(index){
      this.cart.push(this.items[index]);
      this.total += this.items[index].value
    }
  }
});