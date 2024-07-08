<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <h1 calss="like">좋아요 목록</h1>
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
                    <td class="image"  @click="goToDetail()">
                        <img style="width:100%" :src="getImageUrl(item.image)" alt="이미지">
                    </td>
                    <td class="title" @click="goToDetail()">{{ item.title }}</td>
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
        likeList:[],
        good_cate:[1, 2]

    }
}, 
    created() {
        this.fetchLikeList();
    },
    mounted() {
        // this.likeContent();
        
    },
    computed: {
        user() {
            return this.$store.state.user
        }
    },
    methods: {

        async fetchLikeList() {
            try {
                const response = await axios.post(`http://localhost:3000/mypage/like/${this.user.user_no}`);
                this.likeList = response.data;
            } catch(error) {
                console.error('Error');
            }
        },

        getCategoryLabel(good_cate) {
            return good_cate === 1 ? '여행지' : (good_cate === 2 ? '축제' : '');
        },
        
        getImageUrl(image) {
            return image ? require(`../../../node-back/uploads/${image}`) :  require('/goodsempty.jpg'); 
        },

        formatDate(date) {
            return date ? date.split('T')[0] : '';
        },

        goToDetail() {
            if(this.getCategoryLabel(1)) {

                return window.location.href = `http://localhost:8080/tripDetail/${this.item.number}`;
            
            } else{

                return window.location.href = `http://localhost:8080/fesDetail/${this.item.number}`
            }
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


.like {
    position: relative;
    justify-content: center;
    top: 500px;
    left: 740px;
    
}

table {
    margin: auto;
    position: relative;
    top: 140px;
    left: 30px;
    width: 80%;
    
    
}

.category {
    text-align: center;
}

.title {
    text-align: center;
}

.image {
    padding: 5px;
}

.date {
    text-align: center;
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
    position: relative;
    text-align: center;
    white-space: nowrap;
    
}


</style>