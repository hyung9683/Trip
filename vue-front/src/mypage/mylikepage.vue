<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <h1 class="like">좋아요 목록</h1>
        <table class="like-list">
            <colgroup>
                <col width="5%" />
                <col width="7%" />
                <col width="15%" />
                <col width="8%" />
            </colgroup>
            <thead>
                <tr>
                    <th class="like_title cate">카테고리</th>
                    <th class="like_title img">이미지</th>
                    <th class="like_title tit">제목</th>
                    <th class="like_title day">날짜</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in likeList" :key="i">
                    <td class="category">{{ getCategoryLabel(item.good_cate) }}</td>
                    <td class="image" @click="goToDetail(item)">
                        <img style="width:100%" :src="getImageUrl(item)" alt="이미지">
                    </td>
                    <td class="title" @click="goToDetail(item)">{{ item.title }}</td>
                    <td class="date">{{ formatDate(item.good_day) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components: {},
    data() {
        return {
            likeList: [],
            good_cate: [1, 2]
        }
    },
    created() {
        this.fetchLikeList();
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        async fetchLikeList() {
            try {
                const response = await axios.post(`http://localhost:3000/mypage/like/${this.user.user_no}`);
                this.likeList = response.data;
            } catch (error) {
                console.error('Error fetching like list:', error);
            }
        },
        getCategoryLabel(good_cate) {
            return good_cate === 1 ? '여행지' : (good_cate === 2 ? '축제' : '');
        },
        getImageUrl(item) {
            return item.image ? require(`../../../node-back/uploads/${item.image}`) : require('/goodsempty.jpg');
        },
        formatDate(date) {
            return date ? date.split('T')[0] : '';
        },
        goToDetail(item) {
            const url = this.getCategoryLabel(item.good_cate) === '여행지' ?
                `http://localhost:8080/tvdetail/${item.number}` :
                `http://localhost:8080/fsdetail/${item.number}`;
            window.location.href = url;
        }
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

* {
    font-family: 'GmarketSansMedium';
}

.container {
    padding-top: 20px; /* 컨테이너 상단에 패딩 추가 */
}

.like {
    text-align: center;
    margin-top: 0; /* 상단 여백 제거 */
}

table {
    margin: auto;
    width: 80%;
}

.category, .title, .date {
    text-align: center;
}

.image {
    padding: 5px;
}

tbody {
    background-color: #e2e1e0;
}

.like-list th {
    border-top: 1px solid #888;
    background-color: #eee; 
}

.like-list th, td {
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    height: 100%;
}

.like_title {
    text-align: center;
    white-space: nowrap;
}
</style>