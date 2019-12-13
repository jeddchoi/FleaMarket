# Flea Market Website

Window OS를 기준으로 합니다.



## Prefequisites

1. Install MongoDB
2. Install npm, node, 
3. npm install
4. forever
5. supervisor
6. app.settings.env = 'production'



1. Node.js 및 npm 다운로드(https://nodejs.org/ko/download/) : node.js(13.2.0), npm(6.13.2)

2. ```bash
   npm install -g supervisor # 폴더에 변경 사항 있을시 서버 자동 재시작
   npm install -g forever    # 에러나도 서버 무너지지 않음
   ```

3. ```bash
   npm install	# 의존패키지 자동 다운로드 및 설치
   ```

4. MongoDB 다운로드(https://www.mongodb.com/download-center/community)

5. 





## TODO

1. ```javascript
   app.settings.env = 'production'; // 배포시 app.js에서 주석해제
   ```

2. 데이터베이스 미리 데이터 넣어오기, 리포트 하드카피 제출

3. 어떻게 13가지 함수를 구현했는지 서술, 추가기능

4. 





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
    red: 'Category'
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
      values: ['None', 'Registered', 'InProgress', 'Completed']
    }
  },
  priceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
            values: ['Register', 'Unregister', 'Purchase', 'CancelPurchase', 'Bid', 'Draw', 'CancelDraw', 'ConfirmSale', 'ConfirmPurchase']
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





