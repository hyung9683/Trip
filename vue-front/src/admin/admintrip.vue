<template>
  <div>
    <div class="content cate-list">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
      <div class="cate-header">
        <h1>여행지 / 축제</h1>
        <p class="h6"> 총 <strong>{{ tvList.length + fsList.length }}</strong> 개</p>
        <div class="buttons justify-content-end"> <!-- 오른쪽 정렬 -->
          <button class="write_btn" @click="write_trip">여행지 추가</button>
          <button class="write_btn" @click="write_fs">축제 추가</button>
          <button class="write_btn" @click="toggleDeleteMode">삭제</button> <!-- 삭제 버튼 -->
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortCase }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              
              <li><a class="dropdown-item" href="#" @click="sortList(1)">전체</a></li>
              <li><a class="dropdown-item" href="#" @click="sortList2(2)">여행지</a></li>
              <li><a class="dropdown-item" href="#" @click="sortList3(3)">축제</a></li>
            </ul>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <div class="s1" v-for="(row, rowIndex) in rowList" :key="rowIndex" style="height: 270px;  scale:120%">
        <div class="card" style="width: 230px; height: 370px; border:none; margin: 0 1%" v-for="(item, index) in row" :key="index">
          <a class="imgSpace" :href="'http://localhost:8080/' + (item.tv_no ? 'tvdetail/' + item.tv_no : 'fsdetail/' + item.fs_no)">
            <img :width="230" :src="item.tv_img ? require(`../../../node-back/uploads/${item.tv_img}`) : (item.fs_img ? require(`../../../node-back/uploads/${item.fs_img}`) : '/empty.jpg')" alt="이미지" />
          </a>
          <div v-if="deleteMode" class="form-check">
            <input class="form-check-input" type="checkbox" :value="item.tv_no || item.fs_no" v-model="selectedItems">
          </div>
          <div class="card-body" style="padding: 1px;">
            <p class="card-text align-left" style="font-size: 15px" @click="goToDetail(item.tv_no ? item.tv_no : item.fs_no)"> 
              {{ item.tv_tit || item.fs_tit }}
            </p>
            <p class="card-text align-left" style="margin: 0;">
              <span class="badge text-bg-light" style="font-size: 12px">[{{ item.tv_local_nm || item.fs_local_nm }}]</span><br>
              <span v-if="item.fs_date" class="badge text-bg-light" style="font-size: 12px">{{ item.fs_date }}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-if="tvList.length == 0 && fsList.length == 0" class="s1">
        <h1><img src="../assets/img_notReady.png" alt="..." style="text-align: center"></h1>
      </div>
      <nav aria-label="Page">
        <ul class="pagination justify-content-center">
          <ul v-for="i in pageCnt" :key="i" class="pagination justify-content-center">
            <a href="#top" style="text-decoration: none;">
              <li v-if="i != pageNum + 1" class="page-item page-link page_btn" @click="setPage(i)">{{ i }}</li>
              <li v-else class="page-item page-link bg-secondary page_btn btn_active" @click="setPage(i)">{{ i }}</li>
            </a>
          </ul>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tvList: [],
      fsList: [],
      rowList: [],
      sortCase: "전체",
      pageTvList: [],
      pageFsList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 12,
      deleteMode: false, // 삭제 모드 활성화 상태
      selectedItems: [] // 선택된 항목 리스트
    };
  },
  created() {
    this.getTvList(0);
    this.getFsList(0);
  },
  methods: {
    write_trip() {
      this.$router.push({ path: '/admin/writetrip' });
    },
    write_fs() {
      this.$router.push({ path: '/admin/writefs' });
    },
    toggleDeleteMode() {
      if (this.deleteMode) {
        this.deleteSelectedItems();
      }
      this.deleteMode = !this.deleteMode;
    },
    setPage(page) {
      this.pageTvList = [];
      this.pageFsList = [];
      this.pageNum = page - 1;
      this.sliceList();
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageTvList = this.tvList.slice(start, start + this.onePageCnt);
      this.pageFsList = this.fsList.slice(start, start + this.onePageCnt);
      this.arrangeRows();
    },
    sortList(sortNum) {
      if (sortNum == 0) {
        this.sortCase = "최근 순";
      } else if (sortNum == 1) {
        this.sortCase = "오래된 순";
      }

      this.getTvList(sortNum);
      this.getFsList(sortNum);
    },
    sortList2(sortNum) {
      if (sortNum == 2) {
        this.sortCase = "여행지";
        this.fsList = [];
        this.getTvList(sortNum);
      }
    },
    sortList3(sortNum) {
      if (sortNum == 3) {
        this.sortCase = "축제";
        this.tvList = [];
        this.getFsList(sortNum);
      }
    },
    goToDetail(tv_no, fs_no) {
      window.location.href = `http://localhost:8080/${tv_no ? 'tvdetail/' + tv_no : 'fsdetail/' + fs_no}`;
    },
    movetowrite() {
      this.$router.push('/write');
    },
    async getTvList(sortCase) {
      try {
        const response = await axios.get(`http://localhost:3000/admin/tv/${sortCase}`);
        this.tvList = response.data;
        this.pageCnt = Math.ceil((this.tvList.length + this.fsList.length) / this.onePageCnt);
        this.setPage(1);
        this.arrangeRows();
      } catch (error) {
        console.error(error);
      }
    },
    async getFsList(sortCase) {
      try {
        const response = await axios.get(`http://localhost:3000/admin/fs/${sortCase}`);
        this.fsList = response.data;
        this.pageCnt = Math.ceil((this.tvList.length + this.fsList.length) / this.onePageCnt);
        this.setPage(1);
        this.arrangeRows();
      } catch (error) {
        console.error(error);
      }
    },
    arrangeRows() {
      this.rowList = [];
      const rowSize = 4;
      let row = [];
      const combinedList = [...this.pageTvList, ...this.pageFsList];

      combinedList.forEach((item, index) => {
        row.push(item);
        if ((index + 1) % rowSize === 0 || index === combinedList.length - 1) {
          this.rowList.push(row);
          row = [];
        }
      });
    },
    async deleteSelectedItems() {
  try {
    const deleteTvItems = this.selectedItems.filter(item => this.tvList.some(tv => tv.tv_no === item));
    const deleteFsItems = this.selectedItems.filter(item => this.fsList.some(fs => fs.fs_no === item));

    if (deleteTvItems.length > 0) {
      await axios.post('http://localhost:3000/admin/tv/delete', { tv_no: deleteTvItems });
    }

    if (deleteFsItems.length > 0) {
      await axios.post('http://localhost:3000/admin/fs/delete', { fs_no: deleteFsItems });
    }

    this.getTvList(0);
    this.getFsList(0);
  } catch (error) {
    console.error(error);
  }
}
  },
  watch: {
    '$route'() {
      // this.getGoodsList();
    },
    tvList: {
      immediate: true,
      handler() {
        this.arrangeRows();
      }
    },
    fsList: {
      immediate: true,
      handler() {
        this.arrangeRows();
      }
    }
  }
};
</script>

<style scoped>
@font-face {
    font-family: 'ONE-Mobile-Regular';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.page_btn {
    border-radius: 100px;
    color: #cc8c00;
    border: none;
}

.btn_active {
    color: white;
    background-color: #cc8c00;
}

.cate-list {
    font-family: ONE-Mobile-Regular;
}

.tv-nm {
    font-size: 14px;
    color: black;
    font-weight: bold;
}

.tv-tv:hover {
    color: #FFAF7D;
    cursor: pointer;
}

.tv-price {
    font-size: 13px;
}

.cate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cate-header mark {
    height: 36px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #cc8c00;
    background-color: #ffffff;
}

.cate-header .h6 {
    font-size: 14px;
    margin: auto;
}

/* 이미지 확대 */
.imgSpace {
    max-width: 230px;
    max-height: 230px;
    min-width: 100px;
    min-height: 100px;
    overflow: hidden;
    padding: auto;
    border-radius: 15%;
    background-color: #eeeeee;
}

a img {
    margin: auto;
    width: 100%;
    height: 200px;
}

a:hover img {
    transform: scale(1.12);
    transition: all 0.1s linear;
}

a:not(:hover) img {
    transform: scale(1.0);
    transition: all 0.1s linear;
}

/* ----------------------------- */

.card-text {
    margin: 3px;
    margin-top: 5px;
}

.card-text.align-left {
    text-align: left;
}

.card {
    flex-direction: column;
    flex-wrap: wrap;
}

.s1 {
    display: flex;
    margin-bottom: 150px;
}

.content {
    max-width: 1040px;
    width: 80%;
    margin: auto;
    padding-top: 30px;
}

@media screen and (max-width: 768px) {
    img {
        width: auto;
        height: 200px;
        /* object-fit: contain; 이미지 비율 */
    }
}

.write_btn {
    height: 35px;
    width: 100px;
    border: none;
    border-radius: 4px;
    background-color: rgb(230, 168, 84);
    font-family: 'GmarketSansMedium';
    font-size: 16px;
    box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
    margin-left: 10px;
}

.buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end; /* 오른쪽 정렬 */
}
</style>