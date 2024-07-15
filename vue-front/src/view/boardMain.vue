<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <h1>자유게시판</h1>


    <table class="tbList">
      <colgroup>
        <col width="15%" />
        <col width="*" />
        <col width="20%" />
        <col width="20%" />
        <col width="10%" />
      </colgroup>
      <thead>
        <tr>
          <th>no</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in contentlist" :key="board.board_no"
          @click="movetodetail(board.board_no)">
          <td>{{ board.board_no }}</td>
          <td>{{ board.board_tit }}</td>
          <td>{{ board.user_nick }}</td>
          <td>{{ board.board_day.split('T')[0] }}</td>
          <td>{{ board.board_view }}</td>
        </tr>
      </tbody>
      
    </table>
     <form class="navbar_search" @submit.prevent="submitSearch">
       <input v-model="searchboard" class="form-control me-2" type="search" placeholder="내용을 입력해주세요" aria-label="Search">
       <button class="btn-search" type="submit">검색</button>
     </form>

      <div class="btn-cover">
          <button @click="movetopreviouspage" class="page-btn">이전</button>
          <span class="page-count">{{ $route.query.page }}/{{ totalpage }} 페이지</span>
          <button @click="movetonextpage" class="page-btn">다음</button>
      </div>
      <div class="btn">
      <div v-if="user.user_id == ''">
        <button class="write_btn" @click="login">작성</button>
      </div>

      <div v-else>
        <button class="write_btn" @click="write_board">작성</button>

      </div>

    </div>
  </div>
</template>


<script scope>
import axios from 'axios';

export default {
  data() {
    return {
      contentlist: [], //현재 게시판과 페이지에 맞는 글 리스트
      cnt: 0,
      pageSize: 10, //한페이지에 보여지는 정보 갯수
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // 로그인 확인
    },

    totalpage() {
      if (this.cnt == 0) {   // 현재 게시판 글 갯수가 0개일때 총 페이지가 0이 되는거 방지
        return 1;
      } else {
        return Math.ceil(this.cnt / 10);    // (글 갯수/10)한 후 올림 연산을 통해 총 페이지 계산
      }
    }

  },
  mounted() {   // mounted는 페이지가 켜질때 실행됨, 페이지가 켜질때 글 리스트들을 db에서 불러옴
    axios({   
      url: "http://localhost:3000/bd/board_main",
      method: "POST",
      data: {
        page: this.$route.query.page,
        pageSize: this.pageSize
      },
    }).then(res => {
      
      this.contentlist = res.data;
   
      
    }).catch(err => {
      alert(err);
    });
    //글개수 가져오기
    axios({
      url: "http://localhost:3000/bd/boardcnt",
      method: "POST",
      data: {

      },
    }).then(res => {
      this.cnt = res.data;
    }).catch(err => {
      alert(err);
    });


  },
  methods: {
    write_board() {
      this.$router.push({ path: '/boardwrite' });
    },
    login() {
      this.$swal({

        title: '로그인 하신 후에 작성하실 수 있습니다.',
        showConfirmButton: true,
      })
        .then(() => {
          window.location.href = "http://localhost:8080/login";
        })
    },
    movetodetail(board_no){
      window.location.href = window.location.pathname + '/boardDetail?board_no=' + board_no
    },
    //페이징
    movetopreviouspage() {
      if (this.$route.query.page == 1) {
        this.$swal('첫번째 페이지입니다!');
      } else {
        var pp = parseInt(this.$route.query.page) - 1;
        window.location.href = window.location.pathname + '?page=' + pp
      }
    },
    movetonextpage() {
      if (this.$route.query.page == Math.ceil(this.cnt / 10)) {
        this.$swal('마지막 페이지입니다!');
      } else {
        var pp = parseInt(this.$route.query.page) + 1;
        window.location.href = window.location.pathname + '?page=' + pp
      }
    },
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

p {
  height: 10px;
}

div {
  font-family: 'GmarketSansMedium';
  text-align: center;
}

table {
  margin: auto;
  width: 80%;
  border-collapse: collapse; /* 박스 형태로 칸을 구분 */
}

.tbList th,
.tbList td {
  border: 1px solid #ddd;
  padding: 8px;
}

.tbList th {
  background-color: #f2f2f2;
  text-align: center;
}

.tbList td {
  text-align: center;
}

thead {
  background-color: #43D174;
}

.btn {
  display: block;
  height: 70px;
  position: relative;
  top: 10px;
  left: 85.5%;
  width: 50px;
}

.btn-cover {
  margin-bottom: 50px;
  position: relative;
}

.page-count {
  padding: 0 20px 0 20px;
  /* 위 오 아래 왼 간격 조절 */
}

.write_btn {
  height: 35px;
  width: 80px;
  border: none;
  border-radius: 4px;
  background-color: rgb(230, 168, 84);
  font-family: 'GmarketSansMedium';
  font-size: 16px;
  box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
}

button.write_btn:hover {
  cursor: pointer;
  background-color: rgb(230, 168, 84);
}

.page-btn {
  height: 25px;
  width: 60px;
  border: none;
  background-color: transparent;
  font-family: 'GmarketSansMedium';
  font-size: 16px;
  box-shadow: transparent;
}

button.page-btn:hover {
  cursor: pointer;
  background-color: transparent;
}

.btn-search {
  height: 25px;
  width: 60px;
  border: none;
  border-radius: 4px;
  background-color: rgb(230, 168, 84);
  font-family: 'GmarketSansMedium';
  font-size: 16px;
  box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
}

button.btn-search:hover {
  cursor: pointer;
  background-color: rgb(230, 168, 84);
}

.tbList tbody {
  display: table-row-group; /* 테이블 행 그룹으로 설정 */
}

.tbList tbody tr {
  display: table-row; /* 테이블 행으로 설정 */
}

.tbList tbody td {
  border: 1px solid #ddd; /* 테이블 셀에 border 추가 */
  padding: 8px; /* 셀의 padding 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.tbList tbody th {
  background-color: #f2f2f2; /* 테이블 헤더 배경색 */
  border: 1px solid #ddd; /* 테이블 헤더 border 추가 */
  padding: 8px; /* 헤더의 padding 설정 */
  text-align: center; /* 헤더 텍스트 가운데 정렬 */
}
</style>