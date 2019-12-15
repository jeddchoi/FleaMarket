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



![image-20191215135235640](/Users/jed/Library/Application Support/typora-user-images/image-20191215135235640.png)

#### 2. Member Modification / Delete

[Member Edit]:http://localhost:3500/member/:id

You can edit member information or delete on member list page.

![image-20191215135316093](/Users/jed/Library/Application Support/typora-user-images/image-20191215135316093.png)



### Seller

#### 3. Product Registration



#### 4. Product Modification / Product Unregisteration

#### 5. Seller's Product List



### Buyer

#### 6. Product List

[All Products]:http://localhost:3500/product

![image-20191215140421704](/Users/jed/Library/Application Support/typora-user-images/image-20191215140421704.png)

#### 7. Product Search

![image-20191215140922233](/Users/jed/Library/Application Support/typora-user-images/image-20191215140922233.png)

#### 8. Wishlist

![image-20191215140911099](/Users/jed/Library/Application Support/typora-user-images/image-20191215140911099.png)

#### 9. Product Purchase

#### 10. Calculation and Print of Shopping List



### Common

#### 11. Login Page

#### 12. Sign Up Page(with user input validation)

#### 13. Product Page

[Product Detail Page]:http://localhost:3500/product/:id

##### Non-Auction

![image-20191215140532004](/Users/jed/Library/Application Support/typora-user-images/image-20191215140532004.png)

##### Auction

![image-20191215140545924](/Users/jed/Library/Application Support/typora-user-images/image-20191215140545924.png)

## Additional Features

#### 14. Transaction Logs(Administrator)

![image-20191215135730739](/Users/jed/Library/Application Support/typora-user-images/image-20191215135730739.png)

You can view transaction logs when users do 'Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw' or 'CancelDraw'.

#### 15. MyPage



#### 16. Products by Categories

![image-20191215140458004](/Users/jed/Library/Application Support/typora-user-images/image-20191215140458004.png)