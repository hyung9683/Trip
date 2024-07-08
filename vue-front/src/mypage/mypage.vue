<template>
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <h1 class="myinfo">내 정보</h1>
            <table class="mypage-info">
                <tr>
                    <td rowspan="6" class="card" v-if="this.user.user_no === loginuser.user_no">
                        <img v-if="ImageSrc" :src="ImageSrc">
                        <input type="file" class="form-controller" @change="uploadImage">
                    </td>
                </tr>
                <tr>
                    
                </tr>
                <tr>
                    <td class="user-id">아이디:</td>
                    <td class="infodata">{{ loginuser.user_id }}</td>
                 </tr>   
                <tr>
                    <td class="user-nick">닉네임:</td>
                    <td class="infodata">{{ loginuser.user_nick }}</td>
                </tr>
                <tr>
                    <td class="user-email">이메일:</td>
                    <td class="infodata">{{ loginuser.user_email }}</td>
                </tr>
                <tr>
                    <td class="user-adr">주소:</td>
                     <td class="infodata">{{ loginuser.user_adr1 }}</td>
                 </tr>
            </table>
            <button class="btn btn-update" @click=goToUpdate()>회원정보 수정</button>
            <button class="btn btn-delete" @click="confirmDelete(loginuser)">회원탈퇴</button>
        </div>
</template>

<script>
import axios from 'axios';
export default {
    components: {
    },
    data() {
    return {
        loginuser: {},
        ImageSrc: {},

        }
    }, 
    created() {
        this.userInfo();
        this.loadImage();
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
                const response = await axios.get(`http://localhost:3000/mypage/${this.user.user_no}`);
                this.loginuser = response.data[0];
            } catch(err) {
                console.error(err);
            }
            
        },
        goToUpdate() {
            this.$router.push({ path: '/mypage/update'});
        },
        confirmDelete(user) {
            this.$swal({
                title: `${user.user_nick} 회원을 삭제 하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confimButtonText: '삭제',
                cancelButtonText: '취소',
                reversButtons: true 
            }).then(result => {
                if (result.value) {
                    this.deleteUser(user);
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '삭제되었습니다.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        },
        async deleteUser() {
            try {
                const response = await axios.delete(`http://localhost:3000/mypage/delete/${this.user.user_no}`);
                if (response.status === 200) {
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '삭제되었습니다.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // 로그아웃 처리나 홈으로 리디렉션 등 추가 처리
                    this.$store.dispatch('logout'); // Vuex 스토어의 로그아웃 액션 호출
                    this.$router.push({ path: '/' }); // 홈 페이지로 리디렉션
                }
            } catch (err) {
                console.error(err);
                this.$swal({
                    icon: 'error',
                    title: '삭제 실패',
                    text: '계정 삭제에 실패했습니다.'
                });
            }
        },
        //데이터 5mb
        async uploadImage(event) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            console.log(file);

            try {
                const response = await axios.post('http://localhost:3000/mypage/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const imageName = response.data.filename;
                localStorage.setItem('profileImage', imageName);
                this.loadImage();
            } catch (error) {
                console.error(error);
            }
        },
        loadImage() {
            const imageName = localStorage.getItem('profileImage');
            if (imageName && this.user.user_no === this.loginuser.user_no) {
                this.ImageSrc = `http://localhost:3000/mypage/images/${imageName}`;
            } else {
                this.ImageSrc = require(`../../goodsempty.jpg`);
            }
        }
    },
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
    background-color: #DDC9BC;
    position: relative;
    top: 140px;
    right: 30px;
    height: 100%;
    width: 100%;
    overflow:hidden;
}


.mypage-info {
    display:block;
    position: relative;
    box-shadow: 0 1px 1px;
    width: 100%;
    border-collapse: collapse;
    
}

.myinfo {
    position: relative;
    justify-content: center;
    left: 720px;
}


.infodata {
    display:block;
    position: relative;
    align-content: center;
    padding-top: 10px;
    padding-bottom: 2px;
    text-align: center;
    box-shadow: 0 1px 0 #8E7C68;
    
    /* left: 100px; */
    /* bottom: 12px; */
    width:50%;
    top: 4px;
}

.user-id {
    width: 8%;
}

.btn-update {
    position: relative;
    align-content: center;
    justify-content: center;
    align-items: center;
    left: 460px;
    top: 30px;
    scale: 140%;
}

.btn-delete {
    position: relative;
    align-content: center;
    justify-content: center;
    align-items: center;
    left: 510px;
    top: 30px;
    scale: 143%;
}

.card {
    width:25%;
    text-align: center;
    vertical-align: middle;
}

.card img {
    max-width: 100%;
    height: auto;
    border-radius: 1px;
    box-shadow: 0 2px 4px rgb(0, 0, 0, 0.1);
}


input {
    text-align: center;
}

.form-controller {

    width:100%;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    box-sizing: border-box;

}
</style>