let app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        onSale: true,
        brand: 'Vue Mastery',
        image: "src/assets/vmSocks-green-onWhite.jpg",
        selectedVariant: 0,
        altText: "A pair of socks",
        inStock: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
           {
               variantId: 2234,
               variantColor: 'green',
               variantImage: "src/assets/vmSocks-green-onWhite.jpg",
               variantQuantity: 10
           },
           {
               variantId: 2235,
               variantColor: 'blue',
               variantImage: "src/assets/vmSocks-blue-onWhite.jpg",
               variantQuantity: 0
           }
       ],
       cart: 0,    
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeToCart() {
            this.cart -= 1
        },  
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
              return `${this.brand} ${this.product} is on sale!`; // Формирование строки о проведении распродажи
            } else {
              return `${this.brand} ${this.product} is not on sale.`; // Формирование строки о том, что распродажи нет
            }
        }                      
     },
     computed: {
        title() {
            return this.brand + ' ' + this.product;
        }
    }
 
 })
 
 