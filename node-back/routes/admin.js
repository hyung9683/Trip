var express = require('express');
const router = express.Router();
var db = require('../db.js');
var sql = require('../sql.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 게시글 삭제
router.post('/delete', (req, res) => {
  const qnanum = req.body.qnano;

  db.query(sql.deleteContent, [qnanum], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna게시글 수정
router.post('/edit', (req, res) => {
  const editQna = req.body;
  db.query(sql.qnaEdit, [editQna.content, editQna.tit, editQna.qnano], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// 답변 작성
router.post('/write_ans', (req, res) => {
  const writeAns = req.body;
  db.query(sql.ansWrite, [writeAns.qna_ans, writeAns.qna_no], function (error, result) { 
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna 상세 내용
router.post('/qnacontent', (req, res) => {
  const qnano = req.body.qna_no;

  db.query(sql.qnaContent, [qnano], function (error, result1) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result1);


    }
  });
})

// qna 작성
router.post('/write', function (req, res) {
  const writeQna = req.body;

  db.query(sql.qnaWrite, [writeQna.user_no, writeQna.qna_tit, writeQna.qna_content, writeQna.qna_secret], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna목록
router.post('/qna_list', (req, res) => {
  const qnapage = req.body;

  const offsetPage = 0 + (req.body.page - 1) * 10;
  db.query(sql.qna, [qnapage.pagesize, offsetPage], (err, result, fields) => {
    res.send(result);
  });
});

// 관리자 qna목록
router.post('/qna_admin_list', (req, res) => {

  db.query(sql.qnaAdmin, (err, result, fields) => {

    res.send(result);
  });
});

//qna 글 갯수 불러오기
router.post('/boardlistcnt', (req, res) => {
  db.query(sql.qnacnt, (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: '에러' });
    }
    return res.status(200).json(results[0]['COUNT(*)']);
  });
});

//admin 계정을 제외한 모든 사용자 정보 가져오기
router.get('/userinfo', function (req, res) {
  db.query(sql.admin_search, function(error, results, fields) {
      if(error) {
        console.error(error);
          return res.status(500).json({ error: '서버 에러', details: error});
      }

      if (!results || results.length === 0) {
        console.log('No results found');
        return res.status(404).json({ error: '없는 사용자입니다' });
      }
      return res.json(results);
  });
})

module.exports = router;