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

    <p>
    <input type="submit" value="Submit"> 
    </p>

    <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
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
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation required.")
        }},
        addReview(productReview) {
            this.reviews.push(productReview)
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
                <product-details :details="details"></product-details>
               <p>User is premium: {{ premium }}</p>

               <p>Shipping: {{ shipping() }}</p>

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

            <product-review @review-submitted="addReview"></product-review>

            <div>

            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
            <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            </li>
            </ul>
            </div>

            </div>
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

 
 
 