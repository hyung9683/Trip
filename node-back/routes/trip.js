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





module.exports = router;
