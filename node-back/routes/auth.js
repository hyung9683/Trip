const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');  

// 카카오 회원가입
router.post('/kakaoJoinProcess', function (request, response) {
    const kakao = request.body;

    // 데이터 없을 시 가입
    db.query(sql.kakao_check, [kakao.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.kakaoJoin, [kakao.user_id, kakao.user_nick, kakao.user_id], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                } else {
                    return response.status(200).json({
                        message: '저장완료'
                    })
                }
            })
        }
        // 데이터 있으면 로그인 화면으로 이동
        else {
            return response.status(200).json({
                message: 'already_exist_id'
            })
        }
    })
})
// 카카오 로그인

router.post('/kakaoLoginProcess', function (request, response) {
    const kakao = request.body;

    // 데이터 없을 시 회원가입도 진행
    db.query(sql.kakao_check, [kakao.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.kakaoJoin, [kakao.user_id, kakao.user_nick, kakao.user_id], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                }
            })
        }
        // // 로그인 
        // db.query(sql.get_user_no, [kakao.user_id], function (error, results, fields) {
        //     if (error) {
        //         console.log(error)
        //     }
        //     return response.status(200).json({
        //         message: results[0].user_no
        //     })
        // })
        // 로그인
db.query(sql.get_user_no, [kakao.user_id], function (error, results, fields) {
    if (error) {
        console.log(error);
        return response.status(500).json({
            message: 'Database query error'
        });
    }

    // 결과가 비어 있는지 확인
    if (results.length === 0) {
        return response.status(404).json({
            message: 'User not found'
        });
    }

    // user_no가 존재하는지 확인
    const user_no = results[0].user_no;
    if (typeof user_no === 'undefined') {
        return response.status(500).json({
            message: 'User number not found'
        });
    }

    // 성공적으로 user_no를 반환
    return response.status(200).json({
        message: user_no
    });
});
    })
})

// 네이버 로그인
router.post('/naverlogin', function (request, response) {
    const naverlogin = request.body.naverlogin;

    //네이버 중복 로그인 방지
    db.query(sql.naver_id_check, [naverlogin.user_id], function (error, results, fields) {
        if (error) {
            console.log(error);
            return response.status(500).json({
                message: 'DB_error'
            });
        }
        if (results.length > 0) {
            // 가입된 계정 존재 
            db.query(sql.get_user_no, [naverlogin.user_id], function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                return response.status(200).json({
                    message: results[0].user_no
                })
            })
        } else {
            // DB에 계정 정보 입력 
            db.query(sql.naverlogin, [naverlogin.user_email, naverlogin.user_id, naverlogin.user_nick], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                } else {
                    return response.status(200).json({
                        message: '저장완료'
                    })
                }
            })
        }
    })
})

// 회원가입
router.post('/join_process', function (request, response) {

    const user = request.body;
    const encryptedPW = bcrypt.hashSync(user.user_passwd, 10); // 비밀번호 암호화
    console.log(encryptedPW);

    db.query(sql.id_check, [user.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.join, [user.user_id, user.user_nick, user.user_email, encryptedPW, user.user_num, user.user_zipcode, user.user_adr1, user.user_adr2], function (error, data) {
                if (error) {
                    return response.status(500).json({
                        message: 'DB_error'
                    })
                }
                return response.status(200).json({
                    message: 'join_complete'
                });
            })
        }
        else {
            return response.status(200).json({
                message: 'already_exist_id'
            })
        }
    })
})

// 로그인 
router.post('/login_process', function (request, response) {
    const loginUser = request.body;

    db.query(sql.id_check, [loginUser.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            return response.status(200).json({
                message: 'undefined_id'
            })
        }
        else {
            db.query(sql.login, [loginUser.user_id], function (error, results, fields) {
                const same = bcrypt.compareSync(loginUser.user_passwd, results[0].user_passwd);

                if (same) {
                    // ID에 저장된 pw 값과 입력한 pw값이 동일한 경우
                    db.query(sql.get_user_no, [loginUser.user_id], function (error, results, fields) {
                        return response.status(200).json({
                            message: results[0].user_no
                        })
                    })
                }
                else {
                    // 비밀번호 불일치
                    return response.status(200).json({
                        message: 'incorrect_pw'
                    })
                }
            })
        }
    })
})

// 관리자 체크 
router.post('/admin_check', function (request, response) {
    const loginUser = request.body;

    db.query(sql.admin_check, [loginUser.user_no], function (error, results, fields) {
        if (results[0].user_login_ty == 1) {
            // 로그인한 유저의 TP가 1(관리자)인 경우
            return response.status(200).json({
                message: 'admin'
            })
        }
        else {
            return response.status(200).json({
                message: 'user'
            })
        }
    })
})

// 회원리스트
router.get('/admin/userlist/:keyword', function (request, response, next) {

    const keyword = request.params.keyword;
    let search = '';

    if (keyword != 'none') {
        search = ' AND user_email Like "%' + keyword + '%" ';
    }

    db.query(sql.userlist + search, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원리스트에러' });
        }
        response.json(results);
    });
});

// 회원 삭제
router.delete('/admin/userlist/:user_no', function (request, response, next) {
    const userNo = request.params.user_no;

    db.query(sql.deleteUser, [userNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원삭제에러' });
        }
        return response.status(200).json({ message: '회원삭제성공' });
    });
});


// 아이디 찾기
router.post('/findId', function (request, response, next) {
    const user_email = request.body.user_email;

    db.query(sql.id_find, [user_email], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length === 0) {
            // 이메일이 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_id = results[0].user_id; // 사용자 아이디를 가져옴
        return response.status(200).json({
            message: 'user_email',
            user_id: user_id
        });
    });
});

// 랜덤 비밀번호 설정 코드
function generateTempPassword() {
    const length = 8; // 임시 비밀번호의 길이
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        tempPassword += characters[randomIndex];
    }

    return tempPassword;
}

// 비번 찾기 230711
router.post('/find_pass', function (request, response, next) {
    const user_id = request.body.user_id;
    const user_email = request.body.user_email;

    db.query(sql.user_check, [user_email, user_id], async function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length == 0) {
            // 이메일이 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_passwd = generateTempPassword(); // 임시 비밀번호 생성

        const encryptedPW = bcrypt.hashSync(user_passwd, 10); // 임시 비밀번호 암호화

        // 업데이트
        db.query(sql.pass_update_tem, [encryptedPW, user_id], function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: '비번 에러' });
            }
            return response.status(200).json({
                message: user_passwd
            });
        });

    });
});

router.post('/mypage/:user_no', function (req, res) {
    const userno = req.params.user_no;
    console.log(userno);
    db.query(sql.user_info, [userno], function(error, results, fields) {
        if(error) {
            return res.status(500).json({ error: '없는 사용자입니다'});
        }
        console.log(results);
        return res.json(results);
    });
})

module.exports = router;