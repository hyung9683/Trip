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

module.exports = router;