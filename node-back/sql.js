module.exports = {

  // auth
  join: `INSERT INTO trip_user (user_id, user_nick, user_email, user_passwd, user_num, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,

  id_check: `SELECT * FROM trip_user WHERE user_id = ?`,
  get_user_no: `SELECT user_no FROM trip_user WHERE user_id = ?`,
  login: `SELECT user_passwd FROM trip_user WHERE user_id = ?`,

  //카카오 로그인
  kakaoJoin: `INSERT INTO trip_user (user_id, user_nick, user_email, user_login_ty) VALUES(?,?,?,1)`,
  kakao_check: `SELECT * FROM trip_user WHERE user_id = ?`,
  //네이버 로그인
  naverlogin: `INSERT INTO trip_user (user_email, user_id, user_nick, user_login_ty) VALUES (?, ?, ?, 2)`,
  naver_id_check: `SELECT * FROM trip_user WHERE user_id = ?`,

  // admin 기능 
  admin_check: `SELECT user_type FROM trip_user WHERE user_no = ?`,
  userlist: `SELECT user_no, user_id, user_nick, user_email, user_login_ty, user_day
                  FROM trip_user
                  WHERE user_type = 0`,
  deleteUser: `DELETE FROM trip_user WHERE user_no = ?`,

   get_img_nm: `SELECT tv_img, tv_sb_img FROM trip_tv_info WHERE tv_no = ?`,


  //사용자 정보 조회
  user_info: `SELECT user_id, user_nick, user_email, user_num, user_zipcode, user_adr1, user_adr2, user_login_ty
    FROM trip_user
    WHERE user_no = ?`,

  //pass //230709
  get_password: 'SELECT user_passwd FROM trip_user WHERE user_no = ?',
  pass_update: 'UPDATE trip_user SET user_passwd = ? WHERE user_no = ?', 

    // 아이디 비번 찾기
    id_find: `SELECT user_id FROM trip_user WHERE user_email = ?`,
    user_check: `SELECT user_no FROM trip_user WHERE user_email = ? AND user_id = ?`,
    pass_update_tem: `UPDATE trip_user SET user_pw = ? WHERE user_id = ?`,
    

tv_best:`SELECT g.*, IFNULL(t.total_good, 0) AS total_good
FROM trip_tv_info g
LEFT JOIN (
    SELECT tv_no, COUNT(*) AS total_good
    FROM trip_good
    WHERE user_no
    GROUP BY tv_no
) AS t ON g.tv_no = t.tv_no
WHERE g.tv_category IN (1, 2, 3, 4)
ORDER BY total_good DESC;

`,
fs_best:`SELECT h.*, IFNULL(t.total_good, 0) AS total_good
FROM trip_fs_info h
LEFT JOIN (
    SELECT fs_no, COUNT(*) AS total_good
    FROM trip_good
    WHERE user_no
    GROUP BY fs_no
) AS t ON h.fs_no = t.fs_no
WHERE h.fs_category in (1, 2, 3, 4)
ORDER BY total_good DESC;

`, 
  
   /**추가 지도 리스트 */
   tv_list:`select * from trip_tv_info where tv_id = ?`,
   fs_list:`select * from trip_fs_info where fs_id = ?`,

   //qna
   qnaContent: `SELECT * FROM trip_qna JOIN trip_user 
                WHERE trip_qna.user_no=trip_user.user_no AND qna_no = ?;`,
  qnaWrite: `INSERT INTO trip_qna (user_no, qna_tit, qna_content, qna_secret) VALUES (?, ?, ?, ?)`, 
  qna: `SELECT * FROM trip_qna JOIN trip_user 
                WHERE trip_qna.user_no=trip_user.user_no 
                ORDER BY qna_no LIMIT ? OFFSET ?;`,//1  
  
  deleteContent: `DELETE FROM trip_qna WHERE qna_no = ?`, 
  qnaEdit: `UPDATE trip_qna  SET qna_content = ?, qna_tit = ? WHERE qna_no = ?;`, 

  qnaCheck: `SELECT user_ty FROM trip_user WHERE user_no =?;`,
  ansWrite: `UPDATE trip_qna  SET qna_ans = ?  WHERE qna_no = ?;`,
  qnacnt: `SELECT COUNT(*) FROM trip_qna;`,

  review_write: `INSERT INTO trip_review (tv_no, user_no, user_id, review_goat, review_content) VALUES (?, ?, ?, ?, ?);`,
  review_detail: `SELECT tv_tit, tv_ads, tv_content FROM trip_tv_info WHERE tv_no = ?;`,
  get_review: `SELECT * FROM trip_review WHERE tv_no = ?;`,
  
}