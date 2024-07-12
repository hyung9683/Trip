var express = require('express');
const router = express.Router();
var db = require('../db.js');
var sql = require('../sql.js');
const fs = require('fs');
const path = require("path");
const multer = require('multer');

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

// 이미지 업로더 
const upload = multer({
  storage: multer.diskStorage({
      destination(req, file, cb) {
          cb(null, 'uploads');
      },
      filename(req, file, cb) {
          cb(null, file.originalname);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드
router.post('/upload', upload.single('upload'), function(request, response) {
  if(!request.file) {
      return response.status(404).json({ error: '이미지 업로드를 해주세요.'});
  }
  const imagePath = request.file.path
  console.log(imagePath)
  return response.json({ imagePath: imagePath})
}) 

// 게시글 작성
router.post('/tripwrite', function (req, res) {
  const { tv_tit, tv_ads, tv_content, tv_img, tv_sb_img, tv_sb_img2, tv_sb_img3, tv_sb_img4, tv_local_nm } = req.body;

  db.query(sql.trip_write, [tv_tit, tv_ads, tv_content, tv_img, tv_sb_img, tv_sb_img2, tv_sb_img3, tv_sb_img4, tv_local_nm], function (error, result) {
    if (error) {
      console.error('글 작성 에러:', error);
      return res.status(500).json({ error: '글 작성 중 오류가 발생했습니다.' });
    }
    console.log('글 작성 성공:', result);
    // 적절한 응답 처리 (예시로 결과를 그대로 클라이언트에게 반환)
    res.json(result);
  });
});

// 게시글 작성
router.post('/fswrite', function (req, res) {
  const { fs_tit, fs_ads, fs_content, fs_img, fs_sb_img, fs_sb_img2, fs_sb_img3, fs_sb_img4, fs_local_nm } = req.body;

  db.query(sql.fs_write, [fs_tit, fs_ads, fs_content, fs_img, fs_sb_img, fs_sb_img2, fs_sb_img3, fs_sb_img4, fs_local_nm], function (error, result) {
    if (error) {
      console.error('글 작성 에러:', error);
      return res.status(500).json({ error: '글 작성 중 오류가 발생했습니다.' });
    }
    console.log('글 작성 성공:', result);
    // 적절한 응답 처리 (예시로 결과를 그대로 클라이언트에게 반환)
    res.json(result);
  });
});

// 상품 정렬 방식 
function sortCaseReplace(sortCase) {
  let order = ` ORDER BY tv_no Desc`; // 최근 순
  if (sortCase == 0) { // 최근 순
      order = ` ORDER BY tv_no Desc`;
  }
   else if (sortCase == 1) { // 오래된순
      order = ` ORDER BY tv_no`;
  }
  else if (sortCase == 2) { // 오래된순
      order = ` ORDER BY tv_no`;
  }
  return order;
}

// 상품 정렬 방식 2
function sortCaseReplace2(sortCase) {
  let order2 = ` ORDER BY fs_no Desc`; // 최근 순
  if  (sortCase == 3) { // 오래된순
      order2 = ` ORDER BY fs_no`;
  }
  return order2;
}

//전체 여행 리스트1
router.get('/tv/:sortCase', function (request, response, next) {
 
  const sortCase = request.params.sortCase;
  const order = sortCaseReplace(sortCase);

  db.query(sql.all_tv_list + order, function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});
//전체축제리스트
router.get('/fs/:sortCase', function (request, response, next) {

  const sortCase = request.params.sortCase;
 const order2 = sortCaseReplace2(sortCase);

  db.query(sql.all_fs_list + order2, function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});

//전체축제리스트
router.get('/all/:sortCase', function (request, response, next) {

  const sortCase = request.params.sortCase;
 const order3 = sortCaseReplace3(sortCase);

  db.query(sql.all_list + order3, function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});

// 좋아요 목록 조회

router.post('/liketrip', function (req, res) {

      db.query(sql.liketrip, function (error, results, fields) {
          if (error) {
              console.error(error);
          }
          console.log(results);
          return res.json(results);
      })
})

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

// 계정 삭제
router.delete('/delete', function (req, res) {
  const userno = req.body;
  console.log(userno.user_no);
  db.query(sql.user_delete, [userno.user_no], function(error, results, fields) {
      if(error) {
          return res.status(500).json({ error: '삭제 실패' });
      }
      console.log(results);
      return res.json(results);
  });
});

module.exports = router;