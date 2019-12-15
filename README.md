# Flea Market Website

Window OS를 기준으로 합니다.



## Prefequisites

1. Node.js 및 npm 다운로드(https://nodejs.org/ko/download/) : node.js(13.2.0), npm(6.13.2)

2. ```bash
   npm install -g supervisor # 폴더에 변경 사항 있을시 서버 자동 재시작
   npm install -g forever    # 에러나도 서버 무너지지 않음
   ```

3. ```bash
   npm install	# 의존패키지 자동 다운로드 및 설치
   ```

4. MongoDB 다운로드(https://www.mongodb.com/download-center/community)

5. ```bash
   npm start
   ```

6. [FleaMarket 접속]: http://localhost:3500

   

## Database

### User

```json
{
  role: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ['Buyer', 'Seller', 'Admin'],
      message: 'Role should be either "Buyer" or "Seller".'
    }
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Username'),
    unique: true
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Password')
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Name')
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Email')
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: propertyIsRequired.replace('{0}', 'Address')
  },
  boughtProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  bidProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  salt: {
    type: mongoose.Schema.Types.String,
    required: true
  }
}
```



### Product

```json
{
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  name: {
    type: mongoose.Schema.Types.String
  },
  description: {
    type: mongoose.Schema.Types.String
  },
  image: {
    type: mongoose.Schema.Types.String
  },
  price: {
    type: mongoose.Schema.Types.Number,
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  },
  uploadTime: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  },
  isAuction: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ['None', 'Registered','Completed']
    }
  },
  priceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, 
  wishCount: {
    type: mongoose.Schema.Types.Number,
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  }
}
```



### Category

```json
{
  name: {
    type: mongoose.Schema.Types.String,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}
```



### Transaction

```json
{
  type: {
        type: mongoose.Schema.Types.String,
        enum: {
            values: ['Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw', 'CancelDraw']
        }
    },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: mongoose.Schema.Types.Number
  },    
  executedTime: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  }
}
```



## 13 functions

### Administrator Logic

#### 1. Member List

[Member List]:http://localhost:3500/member/index

You can view all member(except administor) list on a data-table.

This page is only shown to administor account and can be accessed by clicking the menu in the navigation which is only shown when an administor account logs in.

The list is sorted by name in default and can be sorted by role, email, and address. You can search with any information shown on the list. You can also decide how many entries you want to show per page. There is a pageination navigation at the bottom of the table.

We used DataTable javascript plugin for implementation.


![image-20191215135235640](/Users/jed/Library/Application Support/typora-user-images/image-20191215135235640.png)

#### 2. Member Modification / Delete

[Member Edit]:http://localhost:3500/member/:id

You can edit member information or delete on member list page. There are two, edit and delete buttons at the far right section of the table. You can either go to the member edit page, or delete the member by pressing those buttons.

![image-20191215135316093](/Users/jed/Library/Application Support/typora-user-images/image-20191215135316093.png)

The member edit page is only shown to an administor account.

The member edit page has the same structure with the account register page. When you go to the member edit page, the form maintains the original account information on the input sections. Clicking the 'Edit' button will edit the member's information with the information you input. There is a 'cancel edit' button at the bottom to cancel editing and this will lead to the member list page.

We used DataTable javascript plugin for implementation.


### Seller

#### 3. Product Registration

You can register a new product on the product register page.

The product register page is only shown to seller accounts.

The product register page follows the member register page design. You have to input category, whether auction or not, name, price, description, and a single image. You can only input numbers inside the price input section. There is also an reset button right next to the upload button for deleting the image mistakenly uploaded. You can register auction products with no price to start from 0. Finally, you can register the product by pressing the 'register' button and if the product is successfully registered, it will lead to the detail page of the corresponding product.

We used Bootstrap 4 card class for section design.


#### 4. Product Modification / Product Unregisteration

You can edit or delete a product on seller mypage. There are two, edit and delete buttons inside the card section for each product. You can either go to the product edit page, or delete the product by pressing those buttons.

The product edit page is only shown to seller accounts.

The product edit page has the same structure with the product register page. When you go to the product edit page, the form maintains the original product information on the input sections. Clicking the 'Edit' button will edit the product's information with the information you input. There is a 'cancel edit' button at the bottom to cancel editing and this will lead to the seller my page.

We used Bootstrap 4 card class for section design.


#### 5. Seller's Product List

You can view registered products on seller mypage. There are auction and non-auction product sections and cards for each products is inside those sections.

The seller mypage is only shown to seller accounts.

The product cards show how many buyers included the product  to the wishlist and for auction product, the auction status of the product is also shown inside the card. The price of the auction product is updated every time the bidding is held. The seller can draw the auction by pressing the 'draw' button inside the auction product cards.

We used Bootstrap 4 card class for section design.


### Buyer

#### 6. Product List

[All Products]:http://localhost:3500/product

![image-20191215140421704](/Users/jed/Library/Application Support/typora-user-images/image-20191215140421704.png)

You can view all products on all prooducts page.

This page is shown to all users including no account users.

The shown products are reversely sorted by upload time so you can see the latest product at the top-left section.

We used Bootstrap 4 card class for section design.

#### 7. Product Search

![image-20191215140922233](/Users/jed/Library/Application Support/typora-user-images/image-20191215140922233.png)

You can search products on product search page.

This page is shown to all users including no account users.

You can search for products by product name, seller name, or price range. two or more condtion combined search is also available.

We used Bootstrap 4 for design.

#### 8. Wishlist

![image-20191215140911099](/Users/jed/Library/Application Support/typora-user-images/image-20191215140911099.png)

You can view wishlist added products on product wishlist page.

This page is only shown to buyer accounts.


#### 9. Product Purchase

You can purchase products in the product detail page.

Non-auction products can be purchased by pressing the buy button. Auction products can be bidded with higher number than the original price and when the seller draws the product, the product is purchased by the last bidded buyer.


#### 10. Calculation and Print of Shopping List

The purchased products price is added to the total purchased amount shown in the buyer mypage. It is inside the account information section.


### Common

#### 11. Login Page

You can login in the login page.

This page can be accessed by pressing the person logo in the top navigation bar. You have to be not logged in.

We used Bootstrap 4 card class for section design.


#### 12. Sign Up Page(with user input validation)

You can sign up and register account in the user register page.

This page can be accessed by pressing the 'Register an Account' button at the bottom section of login page. You have to input account role, user name, password, name, email address, user address. If the confirm password section is different with the password section, the page will reset. Also, if the email address doesn't contain '@' and there is no text after it, or the input section is a blank, error window is shown beneath input section.

We used Bootstrap 4 card class for section design.


#### 13. Product Page

[Product Detail Page]:http://localhost:3500/product/:id

You can view product detail on product detail page.

This page is shown to all users including no account users.

We used Bootstrap 4 for design and DataTable javascript plugin for implementation.

##### Non-Auction

![image-20191215140532004](/Users/jed/Library/Application Support/typora-user-images/image-20191215140532004.png)

You can view all information about the product including product name, category, status, seller name, trading place, upload time. You can add the product to wishlist by pressing the button below the information text.

##### Auction

![image-20191215140545924](/Users/jed/Library/Application Support/typora-user-images/image-20191215140545924.png)

If the product is an auction product, the bidding, and auction history section is shown. You can bid on the product and show the history list data-table in those sections.

## Additional Features

#### 14. Transaction Logs(Administrator)

![image-20191215135730739](/Users/jed/Library/Application Support/typora-user-images/image-20191215135730739.png)

You can view transaction logs on a data-table when users do 'Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw' or 'CancelDraw'.

This page is only shown to administor account and can be accessed by clicking the 'log' menu in the navigation which is only shown when an administor account logs in.

The list is sorted by time in default and can be sorted by transaction type, product, user, and price. You can search with any information shown on the list. You can also decide how many entries you want to show per page. There is a pageination navigation at the bottom of the table.

We used DataTable javascript plugin for implementation.

#### 15. MyPage

##### Buyer
You can view the acoount information, total shop amount on the top section.

Also, you can view purchased non-auction items and auction items on the each bottom two sections.
The cards inside the section can be clicked to move to the detail page of the corresponding product.


##### Seller
You can view the acoount information on the top section.

Also, you can view registered non-auction items and auction items on the each bottom two sections.
The cards inside the section can be clicked to move to the detail page of the corresponding product.
The card includes edit and delete button in common, and draw/draw-cancel button only on auction item section.


##### Admin
You can view the acoount information on the top section.

There's a button on the bottom section for adding new categories. It leads to a category register page.


#### 16. Products by Categories

![image-20191215140458004](/Users/jed/Library/Application Support/typora-user-images/image-20191215140458004.png)

Products can be viewed according to the product's assigned category.

#### 17. Advertisement Carousel Area in Home page

There's an area in the homepage where you can advertise and show banner images. It shows three different images and texts. it also slides automatically ss time goes and can be slided by moblie touch-slide action. We used owl-carousel framework for implementation.


#### 18. Mobile version compatible

The total website is responsive. It is compatible for all browser sizes and shows different structure for moblie users. We used Bootstrap4 for implementation.
