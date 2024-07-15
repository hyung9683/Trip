module.exports = {

  // auth
  join: `INSERT INTO trip_user (user_id, user_nick, user_email, user_passwd, user_num, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,

  id_check: `SELECT * FROM trip_user WHERE user_id = ?`,
  get_user_no: `SELECT user_no FROM trip_user WHERE user_id = ?`,
  login: `SELECT user_passwd FROM trip_user WHERE user_id = ?`,
  //카카오 로그인
  kakaoJoin: `INSERT INTO trip_user (user_id, user_nick, user_email, user_login_ty) VALUES(?,?,?,1)`,
  kakao_check: `SELECT * FROM trip_user WHERE user_id = ?`,
  kakao_delete: `delete from trip_user where user_login_ty = 1 and user_no = ?`,
  //네이버 로그인
  naverlogin: `INSERT INTO trip_user (user_email, user_id, user_nick, user_login_ty) VALUES (?, ?, ?, 2)`,
  naver_id_check: `SELECT * FROM trip_user WHERE user_id = ?`,

  // admin 기능 

   admin_ck: `SELECT user_type FROM trip_user WHERE user_no = ?`,
   //마이페이지 좋아요 리스트 조회
   mylike: `SELECT
   g.user_no,
   g.good_cate,
   g.good_day,
   COALESCE(t.tv_tit, f.fs_tit) as title,
   COALESCE(t.tv_img, f.fs_img) as image,
   COALESCE(t.tv_no, f.fs_no) as number
FROM
   trip_good as g
LEFT JOIN
   trip_tv_info as t ON g.good_cate = 1 AND g.tv_no = t.tv_no
LEFT JOIN
   trip_fs_info as f ON g.good_cate = 2 AND g.fs_no = f.fs_no
WHERE
   g.user_no = ?`,
//사용자 정보 조회
user_info: `SELECT user_id, user_nick, user_email, user_num, user_zipcode, user_adr1, user_adr2, user_login_ty
FROM trip_user
WHERE user_no = ?`,
   // 사용자 정보 수정
  user_update: `update trip_user set user_id = ?, user_nick = ?, user_email = ?, user_num = ?, user_zipcode = ?, user_adr1 = ?, user_adr2 = ? 
  where user_no = ?`,
    //계정 삭제
  user_delete: `delete from trip_user where user_no = ?`,
  soft_Dele: `update trip_user set deleted_at = now() where user_no = ?`,
  //pass
  pass_info: `select user_passwd from trip_user where user_no = ?`,
  pass_update: 'UPDATE trip_user SET user_passwd = ? WHERE user_no = ?', 

    // 아이디 비번 찾기
    id_find: `SELECT user_id FROM trip_user WHERE user_email = ?`,
    user_check: `SELECT user_no FROM trip_user WHERE user_email = ? AND user_id = ?`,
    pass_update_tem: `UPDATE trip_user SET user_passwd = ? WHERE user_id = ?`,
    
//메인 베스트
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
WHERE h.fs_category IN (1, 2, 3, 4)
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
  /**리뷰추가 */
  
  review_write: `INSERT INTO trip_review (tv_no, user_no, user_id, review_goat, review_content, review_cate) VALUES (?, ?, ?, ?, ?, 1);`,
  review_detail: `SELECT tv_tit, tv_ads, tv_content, tv_img, tv_sb_img, tv_sb_img2, tv_sb_img3, tv_sb_img4 FROM trip_tv_info WHERE tv_no = ?;`,
  get_review: `SELECT * FROM trip_review WHERE tv_no = ?;`,

  review_write2: `INSERT INTO trip_review (fs_no, user_no, user_id, review_goat, review_content, review_cate) VALUES (?, ?, ?, ?, ?, 2);`, //리뷰 작성
  review_detail2: `SELECT fs_tit, fs_ads, fs_content, fs_img, fs_sb_img, fs_sb_img2, fs_sb_img3, fs_sb_img4 FROM trip_fs_info WHERE fs_no = ?;`,  //여행지, 축제 정보 가져오기
  get_review2: `SELECT * FROM trip_review WHERE fs_no = ?;`, //등록된 리뷰

  get_my_review: `SELECT review_cate, COALESCE(t.tv_img, f.fs_img) AS image, review_goat, review_content, COALESCE(t.tv_no, f.fs_no) as number, review_no
                FROM trip_review AS r
                LEFT JOIN trip_tv_info AS t ON r.review_cate = 1 AND r.tv_no = t.tv_no
                LEFT JOIN trip_fs_info AS f ON r.review_cate = 2 AND r.fs_no = f.fs_no
                WHERE user_no = ? 
                ORDER BY review_no DESC 
                LIMIT ? OFFSET ?;`,
  get_my_review_count: `SELECT COUNT(*) AS count FROM trip_review WHERE user_no = ?;`,
  myqna: `SELECT * FROM trip_qna WHERE user_no = ? ORDER BY qna_no DESC LIMIT ? OFFSET ?`,
  my_qnacnt: `SELECT COUNT(*) AS count FROM trip_qna WHERE user_no = ?`,
  myboard_cnt: `SELECT COUNT(*) AS count FROM trip_board WHERE user_no = ?`,

  myboard: `select * from trip_board join trip_user 
        where trip_board.user_no=trip_user.user_no and trip_board.user_no = ? ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
  deletereview: 'DELETE FROM trip_review WHERE review_no = ?',
 // 상세페이지 좋아요
        like_insert: `INSERT INTO trip_good (user_no, tv_no, good_cate) VALUES (?, ?, 1)`,
        like_delete: `DELETE FROM trip_good WHERE user_no = ? AND tv_no = ?`,
        like_check: `SELECT * FROM trip_good WHERE user_no = ? AND tv_no = ?`,
        like_count: `SELECT COUNT(*)  FROM trip_good WHERE tv_no = ?`,

        like_insert2: `INSERT INTO trip_good (user_no, fs_no, good_cate) VALUES (?, ?, 2)`,
        like_delete2: `DELETE FROM trip_good WHERE user_no = ? AND fs_no = ?`,
        like_check2: `SELECT * FROM trip_good WHERE user_no = ? AND fs_no = ?`,
        like_count2: `SELECT COUNT(*)  FROM trip_good WHERE fs_no = ?`,
  /**검색 */
  tv_searchlist: `SELECT tv_category, tv_no, tv_tit, tv_img, tv_price, tv_ads, tv_local_nm, tv_id
  FROM trip_tv_info
  WHERE tv_tit LIKE ?`,
  fs_searchlist: `SELECT fs_category, fs_no, fs_tit, fs_img, fs_price, fs_ads, fs_local_nm, fs_date, fs_id
  FROM trip_fs_info
  WHERE fs_tit LIKE ?`,

//전체목록
  all_tv_list: `SELECT tv_no, tv_tit, tv_img, tv_local_nm
  FROM trip_tv_info`,
  all_fs_list: `SELECT fs_no, fs_tit, fs_img, fs_local_nm, fs_date
  FROM trip_fs_info`,
  tv_list_delete: `DELETE FROM trip_tv_info WHERE tv_no IN (?)`,
  fs_list_delete: `DELETE FROM trip_fs_info WHERE fs_no IN (?)`,

  //
  trip_write: `INSERT INTO trip_tv_info (tv_tit, tv_ads, tv_content, tv_img, tv_sb_img, tv_sb_img2, tv_sb_img3, tv_sb_img4, tv_local_nm, tv_id, tv_category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
  fs_write: `INSERT INTO trip_fs_info (fs_tit, fs_ads, fs_content, fs_img, fs_sb_img, fs_sb_img2, fs_sb_img3, fs_sb_img4, fs_local_nm, fs_price, fs_date, fs_id, fs_category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2);`,

  liketrip: `SELECT 
  t.tv_tit, 
  IFNULL(g.total_good, 0) AS total_good
FROM 
  trip_tv_info t
LEFT JOIN (
  SELECT tv_no, COUNT(*) AS total_good
  FROM trip_good
  GROUP BY tv_no
) g ON t.tv_no = g.tv_no;`,

likefs: `SELECT 
  f.fs_tit, 
  IFNULL(g.total_good, 0) AS total_good
FROM 
  trip_fs_info f
LEFT JOIN (
  SELECT fs_no, COUNT(*) AS total_good
  FROM trip_good
  GROUP BY fs_no
) g ON f.fs_no = g.fs_no;`,

viewcount: `SELECT board_tit, board_view
          FROM trip_board;`,

// admin 기능 

admin_search: `SELECT * FROM trip_user`,

    //게시판 기능
    board_write: `INSERT INTO trip_board(board_tit, board_content,user_no, board_img) VALUES(?, ?, ?, ?);`,
    show_board: `select * from trip_board join trip_user 
          where trip_board.user_no=trip_user.user_no and trip_board.user_no ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
    board_cnt: `SELECT COUNT(*) FROM trip_board`,
    board_search: `SELECT * FROM trip_board WHERE board_tit LIKE ? ORDER BY board_no DESC LIMIT ? OFFSET ?`,
    board_admin: `SELECT * FROM trip_board JOIN trip_user WHERE trip_board.user_no = trip_user.user_no`, //1
    board_Detail: `SELECT * FROM trip_board JOIN trip_user WHERE trip_board.user_no=trip_user.user_no AND board_no = ?; `, //게시글 상세
    board_delete: `DELETE FROM trip_board WHERE board_no = ?`,
    board_Edit: `UPDATE trip_board SET board_content = ?, board_tit = ? WHERE board_no = ?;`,
    comment_list: `SELECT comment_id, comment_content, parent_comment_id, comment_at, user_no, board_no FROM board_comments WHERE board_no = ?`,
    comment_write: `INSERT INTO board_comments(user_no, comment_content) VALUES(?, ?)`,

    boardcnt: `SELECT COUNT(*) FROM trip_board`,

    adminboard: `select * from trip_board join trip_user 
          where trip_board.user_no=trip_user.user_no and trip_board.user_no ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
    deleteboard: `DELETE FROM trip_board WHERE board_no = ?`,
    
}