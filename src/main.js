Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: 'Socks',
            onSale: true,
            inStockBlock: false,
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
                variantImage: "../src/assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "../src/assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],
            cart: 0,    
        }
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
            },
            shipping() {
                if (this.premium) {
                    return "Free";
                } else {
                    return 2.99
                }
             }                                  
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="image" v-bind:alt="altText"/>
            </div>
     
            <div class="product-info">
               <h1>{{ title }}</h1>
                <h1>{{ product }}</h1>
                <p v-if="onSale">{{ sale() }}</p>
                <p v-else="!onSale">{{ sale() }}</p>
                <p>In stock</p>
                <p :class="{ 'outOfStock': !inStock }">Out of Stock</p>
                <ul>
                  <li v-for="detail in details">{{ detail }}</li>
               </ul>
               <p>User is premium: {{ premium }}</p>

               <p>Shipping: {{ shipping() }}</p>

               <div
               class="color-box"
               v-for="variant in variants"
               :key="variant.variantId"
               :style="{ backgroundColor: variant.variantColor }"
               @mouseover="updateProduct(index)"
               >
               </div>
               </div>
               <div class="cart">
                  <p>Cart({{ cart }})</p>
               </div>
               <button 
                  v-on:click="addToCart" 
                  :disabled="!inStock" 
                  :class="{ disabledButton: !inStock }">
                  Add to cart
               </button>

               <button 
                  v-on:click="addToCart" 
                  :disabled="!inStockBlock" 
                  :class="{ disabledButton: !inStockBlock }">
                  Add to cart
               </button>
            </div>

               <button v-on:click="removeToCart">Remove to cart</button>

            </div>
    </div>
  `, 
 })

 let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})

 
 
 