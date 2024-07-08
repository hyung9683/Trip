<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <div class="userPage">
                <h2>회원정보</h2>
            </div>

        
            <table class="userinfo">
                <colgroup>
                    <col width="14%" />
                    <col width="14%" />
                     <col width="20%" />
                    <col width="20%" />
                    <col width="12%" />
                     <col width="18%" />
                 </colgroup>
                 <thead>
                    <tr>
                        <th class="user_title id">아이디</th>
                        <th class="user_title nick">닉네임</th>
                        <th class="user_title img">이미지</th>
                        <th class="user_title email">이메일</th>
                        <th class="user_title logty">로그인타입</th>
                        <th class="user_title date">가입일</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr v-for="(item, i) in filterUserList" :key="i">
                        <td class="users">{{ item.user_id }}</td>
                        <td class="nick">{{ item.user_nick }}</td>
                        <td class="image">
                            <img style="width:80%;" :src="image.profileImageUrl && item.user_no ? require(`../../../node-back/myImg/${image.profileImageUrl}`) : require('/goodsempty.jpg')"  alt="프로필 이미지">
                        </td>
                        <td>{{ item.user_email }}</td>
                        <td>{{ item.user_login_ty }}</td>
                        <td>{{ formatDate(item.user_day) }}</td>
                        <td><button class="del_btn" @click="confirmDeleteContent(item.user_no)">삭제</button></td>
                    </tr>
                 </tbody>
            </table>

            <div class="btn-cover">
                <button @click="movetoprveiouspage" class="page-btn">이전</button>
                <span class="page-count">{{ $route.query.page }}/{{ totalpage }}페이지</span>
                <button @click="movetonextpage" class="page-btn">다음</button>
            </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
    return {
        userList:[],
        image: {},
        contentlist: [],
        pageSize: 10,
        cnt: 0 // 현재 게시글 수
    }
}, 
    created() {
        this.info();
    },
    mounted() {},
    computed: {
        user() {
            return this.$store.state.user
        },
        filterUserList() {
            return this.userList.filter(item => item.user_type !== 1);
        },
        totalpage() {
            if (this.cnt == 0) {
                return 1;
            } else {
                return Math.ceil(this.cnt / 10);
            }
        }
        
    },
    methods: {
        async info() {
            try {
                const response = await axios.get(`http://localhost:3000/admin/userinfo`);       
                this.userList = response.data;
                console.log(this.userList);
            } catch(error) {
                console.error(error);
            }
        },
        formatDate(date) {
            return date ? date.split('T')[0] : '';
        },

        movetoprveiouspage() {
            if (this.$route.query.page == 1) {
                this.$swal('첫번째 페이지입니다');
            } else {
                let pp = parseInt(this.$route.quert.page) - 1;
                window.location.href = window.location.pathname + '?page=' + pp
            }
        },
        movetonextpage() {
            if (this.$route.query.page == Math.ceil(this.cnt / 10)) {
                this.$swal('마지막 페이지입니다.');

            } else {
                let pp = parseInt(this.$route.query.page) + 1;
                window.location.href = window.location.pathname + '?page=' + pp
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

div {
    font-family: 'GmarketSansMedium';
    text-align: center;
}

.userPage {
    position: relative;
    text-align: center;
}

/* .userinfo {
    position: relative;
    justify-content: center;
    text-align: center;
} */

table {
    margin: auto;
    position: relative;
    width: 80%;
}

 .userinfo th {
    border-top: 1px solid #888;
    background-color: #eee;
 }

 .userinfo th, td {
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    height: 100%;
 }

 td {
    text-align: center;
 }

 thead {
    background-color: #e2e1e0
 }

 .page-btn {
    height: 25px;
    width: 50px;
    border: none;

    background-color: #aeaeae;
    font-family: 'GmarketSansMedium';
    font-size: 14px;
    box-shadow: 0px 1px 10px 0.1px rgb(240, 240, 240);
 }

 button.page-btn:hover {
    cursor: pointer;
    background-color: rgb(161, 161, 161);
 }

 .page-count {
    padding: 0 20px 0 20px;
 }

 .btn-cover {
    position: relative;
    top: 20px;
 }

 .del_btn {
    height: 23px;
    width: 50px;
    border: none;
    background-color: #aeaeae;
    font-family: 'GmarketSansMedium';
    font-size: 14px;
 }

 button.del_btn:hover {
    cursor: pointer;
    background-color: rgb(161, 161, 161);
 }
</style>