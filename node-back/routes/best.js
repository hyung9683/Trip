const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const multer = require('multer');
const path = require("path");

// 메인 상품 리스트 
router.get('/tvbest', function (request, response, next) {
    db.query(sql.tv_best, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        response.json(results);
    });
});
// 메인 상품 리스트 2
router.get('/fsbest', function (request, response, next) {
    db.query(sql.fs_best, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        response.json(results);
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

// 여행 리스트1
router.get('/tvSearch/:keyword/:sortCase', function (request, response, next) {
    const keyword = '%' + request.params.keyword + '%';
    const sortCase = request.params.sortCase;

    const order = sortCaseReplace(sortCase);
    

    db.query(sql.tv_searchlist + order, [keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
//축제리스트2
router.get('/fsSearch/:keyword/:sortCase', function (request, response, next) {
    const keyword = '%' + request.params.keyword + '%';
    const sortCase = request.params.sortCase;

   const order2 = sortCaseReplace2(sortCase);

    db.query(sql.fs_searchlist + order2, [keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
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
module.exports = router;