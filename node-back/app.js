const express = require('express');
const cors = require('cors');
const app = express();

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
const MyPage = require('./routes/mypage');

app.use('/tripList', tripRouter);
app.use('/auth', authRouter);
app.use('/best', bestRouter);
app.use('/qna', qnaRouter);
app.use('/mypage', MyPage);

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
});