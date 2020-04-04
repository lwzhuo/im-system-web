<template>
  
</template>

<script>
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-page-container {
  padding: 80px 0px 0px 0px;
}

.login-container {
  width: 390px;
  margin: 0px auto;
  padding: 0px;
  background-color: #fff;
}

.login-header {
  padding: 0px 0px 75px 0px;
  margin: 0px 0px 15px 0px;
  position: relative;
  border-bottom: 1px solid #ddd;
  z-index: 10;
  -webkit-transition: padding-bottom 0.4s;
  transition: padding-bottom 0.4s;  
  text-align: center;
  .login-title-container {
    padding-top: 30px;
    .login-title {
      color: #1685C1;
      font-size: 25px;
    }    
  }
  .profile-image {
    position: absolute;
    width: 85px;
    height: 85px;  
    margin: 30px 0px 0px 152px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-clip: content-box;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 15px;
    background-image: url(../../assets/images/undefined-user.png);
  }    
}

.login-content {
  padding: 50px 40px 20px;
  -webkit-transition: padding-top 0.4s;
  transition: padding-top 0.4s;
  .login-username {
    width: 20px;
    height: 20px;
    margin: 0px -10px;
    background-image: url(../../assets/images/user.png);
  }
  .login-password {
    width: 20px;
    height: 20px;
    margin: 0px -10px;
    background-image: url(../../assets/images/lock.png);
  }
  .login-button {
    width: 100%;
  }
}

.login-footer {
  font-size: 13px;
  padding: 0px 40px 40px;
  text-align: left;
}
</style>


