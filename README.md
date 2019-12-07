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

2. 