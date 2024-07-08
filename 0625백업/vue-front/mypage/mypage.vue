<template>
    <div class="mypage">
        <div class="mypage-info">
            <div class="id">아이디: </div>
            <div class="data">{{ loginuser.user_id }}</div>
            <div class="nickname">닉네임: </div>
            <div class="data">{{ loginuser.user_nickname }}</div>
            <div class="email">이메일: </div>
            <div class="data">{{ loginuser.user_email }}</div>
            <div class="adr">주소: </div>
            <div class="data">{{ loginuser.user_adr1 }}</div>
        </div>
        <button class="btn update" @click=goToUpdate()>회원정보 수정</button>
        <button class="btn delete" @click="Deleteinfo()">회원탈퇴</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    components: {
    },
    data() {
    return {
        loginuser: {}

        }
    }, 
    created() {
        this.userInfo();
    },
    mounted() {
    },
    computed: {
        user() {
            return this.$store.state.user; // 로그인 여부
        }
    },
    methods: {
        async userInfo() {
            try{
                const response = await axios.post(`http://localhost:3000/auth/mypage/${this.user.user_no}`);
                this.loginuser = response.data[0];
            } catch(err) {
                console.error(err);
            }
            
        }
    }
}
</script>
<style>
.mypage-info {
    position: relative;
    align-content: center;
    justify-content: center;
    left: 400px;
    top: 00px;
}

.data {
    position: relative;
    align-content: center;
    justify-content: center;
    left: 500px;
}
</style>