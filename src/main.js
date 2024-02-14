let eventBus = new Vue()
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
      <div>
        <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="tab in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul v-else>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
      </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    }
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
        <ul>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="tab in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
      </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})
Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>

        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p v-if="rating >= 3">Would you recommend this product?</p>
        <label v-if="rating >= 3">
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label v-if="rating >= 3">
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
        <label v-show="rating < 3"></label>

        <p>
          <input type="submit" value="Submit">
        </p>
      </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
}) 
Vue.component('product-details', {
    props: {
        details: {
          type: Array,
          required: true
        }
      },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        `,
 }),
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
                variantImage: 'src/assets/vmSocks-green-onWhite.jpg',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: 'src/assets/vmSocks-blue-onWhite.jpg',
                variantQuantity: 5
            }
        ],
            cart: [], 
            reviews: []   
        }
    },
    methods: {
            addToCart() {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            },
            updateCart(id) {
                this.cart.push(id);
            },         
            updateProduct(variantImage) {
                this.image = variantImage
            },             
            removeToCart() {
                this.cart -= 1
            },
            removeFromCart: function() {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
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
            },
        },
        created() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="image" 
                v-bind:alt="altText"/>
            </div>
     
            <div class="product-info">
               <h1>{{ title }}</h1>
                <h1>{{ product }}</h1>
                <p v-if="onSale">{{ sale() }}</p>
                <p v-else="!onSale">{{ sale() }}</p>
                <p v-if="inStock" && variants.variantColor === 'green'>In stock</p>
                <p v-if="variant.variantColor === 'blue'">Out of Stock</p>
                <product-details :details="details"></product-details>
               <p>User is premium: {{ premium }}</p>

               <info-tabs :shipping="shipping()" :details="details"></info-tabs>

               <product-tabs :reviews="reviews"></product-tabs>

               <div class="color-box"
               v-for="variant in variants"
               :key="variant.variantId"
               :style="{ backgroundColor:variant.variantColor }"
               @mouseover="updateProduct(variant.variantImage)"
               >
               </div>
               </div>
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

            <button @click="removeFromCart">Remove from cart</button>
            </div>
            <div>
    </div>
  `, 
 })

 let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeItem(id) {
            for(let i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }
})

 
 
 