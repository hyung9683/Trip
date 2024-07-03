const express = require('express');
const db = require('../db');
const sql = require('../sql');
// const fs = require('fs');

const router = express.Router();
// const multer = require('multer');
// const path = require('path');

router.get('/regions/:regionid', function (req, res) { // 지역별 여행지 리스트
    const regionid = req.params.regionid
    db.query(sql.tv_list, [regionid], (err, results, fields) => {
        if (err) {
            console.error(err);
            return res.status(500).json({err: '에러'});
        }
        res.json(results);
    });
});

router.get('/regions/api/:regionid', function(req, res) {
    const regionid = req.params.regionid
    db.query(sql.fs_list, [regionid], (err, results, fields) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ err: '에러' });
        }
        res.json(results);
    });
});



// 특정 tv_no를 가진 축제 정보 가져오기
router.get('/trip/:tv_no', (req, res) => {
    const tvNo = req.params.tv_no;
    db.query(sql.review_detail, [tvNo], (err, results) => {
        if (err) {
            console.error('Error fetching festival details:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 특정 tv_no에 리뷰 추가하기
router.post('/trip/:tv_no/reviews', (req, res) => {
    const tvNo = req.params.tv_no;
    const { user_no, user_id, review_goat, review_content } = req.body;
    db.query(sql.review_write, [tvNo, user_no, user_id, review_goat, review_content], (err, results) => {
        if (err) {
            console.error('Error adding review:', err);
            res.status(500).send(err);
        } else {
            res.json({ id: results.insertId });
        }
    });
});

// 특정 tv_no에 해당하는 리뷰 가져오기
router.get('/trip/:tv_no/reviews', (req, res) => {
    const tvNo = req.params.tv_no;
    db.query(sql.get_review, [tvNo], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

router.get('/regions/api/:regionid', function(req, res) {
    const regionid = req.params.regionid
    db.query(sql.fs_list, [regionid], (err, results, fields) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ err: '에러' });
        }
        res.json(results);
    });
});

// 특정 fs_no를 가진 축제 정보 가져오기
router.get('/festivals/:fs_no', (req, res) => {
    const fsNo = req.params.fs_no;
    db.query(sql.review_detail2, [fsNo], (err, results) => {
        if (err) {
            console.error('Error fetching festival details:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 특정 fs_no에 리뷰 추가하기
router.post('/festivals/:fs_no/reviews', (req, res) => {
    const fsNo = req.params.fs_no;
    const { user_no, user_id, review_goat, review_content } = req.body;
    db.query(sql.review_write2, [fsNo, user_no, user_id, review_goat, review_content], (err, results) => {
        if (err) {
            console.error('Error adding review:', err);
            res.status(500).send(err);
        } else {
            res.json({ id: results.insertId });
        }
    });
});

// 특정 fs_no에 해당하는 리뷰 가져오기
router.get('/festivals/:fs_no/reviews', (req, res) => {
    const fsNo = req.params.fs_no;
    db.query(sql.get_review2, [fsNo], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 좋아요 추가
router.post('/likeInsert/:tv_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const tv_no = request.params.tv_no;

    db.query(sql.like_check, [user_no, tv_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            db.query(sql.like_insert, [user_no, tv_no], function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: '에러' });
                }

                return response.status(200).json({ message: 'complete', isLiked: false });
            });
        }
    });
});

// 좋아요 제거
router.post('/likeDelete/:tv_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const tv_no = request.params.tv_no;

    db.query(sql.like_delete, [user_no, tv_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json({ message: 'complete' });
    });
});

// 좋아요 체크
router.post('/likeCheck/:tv_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const tv_no = request.params.tv_no;

    if (user_no == 'null') {
        return response.status(200).json({ message: 'complete', isLiked: false });
    }

    db.query(sql.like_check, [user_no, tv_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            return response.status(200).json({ message: 'complete', isLiked: false });
        }
    });
});

// 좋아요 카운트
router.get('/likeCount/:tv_no', function (request, response, next) {
    const tv_no = request.params.tv_no;

    db.query(sql.like_count, [tv_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});

// ----------------------------축제//
// 좋아요 추가2
router.post('/likeInsert2/:fs_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const fs_no = request.params.fs_no;

    db.query(sql.like_check2, [user_no, fs_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            db.query(sql.like_insert2, [user_no, fs_no], function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: '에러' });
                }

                return response.status(200).json({ message: 'complete', isLiked: false });
            });
        }
    });
});

// 좋아요 제거
router.post('/likeDelete2/:fs_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const fs_no = request.params.fs_no;

    db.query(sql.like_delete2, [user_no, fs_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json({ message: 'complete' });
    });
});

// 좋아요 체크
router.post('/likeCheck2/:fs_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const fs_no = request.params.fs_no;

    if (user_no == 'null') {
        return response.status(200).json({ message: 'complete', isLiked: false });
    }

    db.query(sql.like_check2, [user_no, fs_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            return response.status(200).json({ message: 'complete', isLiked: false });
        }
    });
});

// 좋아요 카운트
router.get('/likeCount2/:fs_no', function (request, response, next) {
    const fs_no = request.params.fs_no;

    db.query(sql.like_count2, [fs_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});

module.exports = router;
