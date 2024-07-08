const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors({      // cors 설정을 해줘야 front 서버와 통신 가능
    origin: 'http://localhost:8080',
    credentials: true,
}));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');
const bestRouter = require('./routes/best');
const tripRouter = require('./routes/trip');
const qnaRouter = require('./routes/qna');
const adminRouter = require('./routes/admin');
const MyPage = require('./routes/mypage');


app.use('/trip', tripRouter);
app.use('/auth', authRouter);
app.use('/best', bestRouter);
app.use('/admin', adminRouter);
app.use('/qna', qnaRouter);
app.use('/mypage', MyPage);

// 정적 파일 제공 설정
const uploadDirectory = 'myImg/';
app.use('/images', express.static(path.join(__dirname, uploadDirectory)));

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
});