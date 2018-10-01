LOAD_NUM = 10;

new Vue({
  el: '#app',
  data:{
    searched: '',
    search: '',
    searchError: '',
    searching: false,
    total: 0,
    items: [],
    itemsNotLoaded: [],
    cart: new Map()
  },
  methods:{
    onSubmit: function(){
      this.searching = true;
      this.searchError = '';
      if(!this.search){
        this.searchError = 'Type something to search.'
        this.searching = false;
        return;
      }
      this.$http
        .get('/search/'.concat(this.search))
        .then(function(resp){
          this.items = [];
          this.itemsNotLoaded = resp.data;
          this.loadMoreItems();
          this.searched = this.search;
          this.search = '';
          this.searching = false;
        })
        .catch( err => {
          console.log(err);
          this.searching = false;
          this.searched = '';
          this.search = '';
        });
    },
    addItem: function(index){
      var itemDetail = this.cart.get(this.items[index]);
      if(itemDetail){
        incrementBy(itemDetail, 1, this.items[index].score/100);
        setItemInCart(this.cart, this.items[index], itemDetail, this);
      }else{
        setItemInCart(this.cart, this.items[index], {
          times: 1,
          value: this.items[index].score/100
        }, this);
      }
    },
    incrementItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, 1, item.score/100);
      setItemInCart(this.cart, item, itemDetail, this);
    },
    decrementItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, -1, item.score/100);
      setItemInCart(this.cart, item, itemDetail, this);
    },
    removeItem: function(item){
      var itemDetail = this.cart.get(item);
      incrementBy(itemDetail, -1*itemDetail.times, item.score/100);
      setItemInCart(this.cart, item, itemDetail, this);
    },
    loadMoreItems: function(){
      var toLoadElements = this.itemsNotLoaded.slice(this.items.length, this.items.length+LOAD_NUM);
      this.items = this.items.concat(toLoadElements);
    }
  },
  filters: {
    currency: function(price){
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    var bottomList = document.getElementById('product-list-bottom');
    var vueInstance = this;
    var watcher = scrollMonitor.create(bottomList);
    watcher.enterViewport(function(){
      vueInstance.loadMoreItems();
    });
  },
  computed: {
    noMoreItems: function(){
      return this.items.length > 0 && this.items.length == this.itemsNotLoaded.length;
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
