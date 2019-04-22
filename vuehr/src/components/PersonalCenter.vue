<template>
  <el-form
    ref="hrInfo"
    :model="hrInfo"
    label-width="80px"
    :rules="rules"
    style="height: 80px;line-height: 80px;"
  >
    <el-form-item label="头像" style="text-align:left;margin-top:22px;">
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8083/images/upload"
        :headers=headers
        name="imageFile"
        :show-file-list="false"
        :multiple="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="hrInfo.userface" :src="hrInfo.userface" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="hrInfo.name" :disabled="isEdit"></el-input>
    </el-form-item>
    <el-form-item label="登录账号" prop="username">
      <el-input v-model="hrInfo.username" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="hrInfo.password" :disabled="isEdit" :type="typeVisable">
        <i slot="suffix" class="el-icon-view" @click="handleIconClick"></i>
      </el-input>
    </el-form-item>
    <el-form-item label="重新输入" v-if="updateInfo" prop="repeatPass">
      <el-input v-model="hrInfo.repeatPass" :disabled="isEdit" :type="typeVisable0">
        <i slot="suffix" class="el-icon-view" @click="handleIconClick0"></i>
      </el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="hrInfo.phone" :disabled="isEdit">
        <i slot="suffix" class="el-icon-mobile-phone"></i>
      </el-input>
    </el-form-item>
    <el-form-item label="座机" prop="telephone">
      <el-input v-model="hrInfo.telephone" :disabled="isEdit">
        <i slot="suffix" class="el-icon-phone-outline"></i>
      </el-input>
    </el-form-item>
    <el-form-item label="住址" prop="address">
      <el-input v-model="hrInfo.address" :disabled="isEdit">
        <i slot="suffix" class="el-icon-location-outline"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('hrInfo')">{{editBtn}}</el-button>
      <el-button @click="cancelEdit">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      hrInfo: {
        name: "",
        password: "",
        phone: "",
        telephone: "",
        address: "",
        userface: "",
        id: "",
        repeatPass: ""
      },
      isEdit: true,
      editBtn: "编辑",
      typeVisable: "password",
      typeVisable0: "password",
      updateInfo: false,
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            message: "必填:手机号",
            trigger: "blur"
          },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "手机号号码格式不正确",
            trigger: "blur"
          }
        ],
        address: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      }
    };
  },
  mounted: function() {
    this.hrInfo = JSON.parse(JSON.stringify(this.$store.state.userInfo));
    this.fetchPassword();
  },
  methods: {
    /**
     * 点击显示密码
     */
    handleIconClick: function() {
      this.typeVisable = this.typeVisable === "password" ? "text" : "password";
    },
    handleIconClick0: function() {
      this.typeVisable0 =
        this.typeVisable0 === "password" ? "text" : "password";
    },
    handleAvatarSuccess(res, file) {
      this.hrInfo.userface = URL.createObjectURL(file.raw);
      this.$store.commit("loginUserInfo", {userface:res.uri});

    },
    /**
     * 获取密码
     */
    fetchPassword() {
      let that = this;
      this.postRequest("/personal/hr/fetchPass", { id: this.hrInfo.id }).then(
        function(data) {
          that.hrInfo.password = data.data.password;
          that.hrInfo.repeatPass = data.data.password;
        }
      );
    },
    updateHrUserInfo() {
      let that = this;
      this.postRequest("/personal/hr/updateHrInfo", {name:that.hrInfo.name,password:that.hrInfo.password,phone:that.hrInfo.phone,
      telephone:that.hrInfo.telephone,address:that.hrInfo.address,id:that.hrInfo.id,userface:that.$store.userface
      }).then(function(
        data
      ) {
        that.isEdit = !that.isEdit;
        that.editBtn = that.editBtn === "提交" ? "编辑" : "提交";
        that.updateInfo = that.editBtn === "提交" ? true : false;
        /**
         * 更新store数据
         */
         that.$store.commit("loginUserInfo", that.hrInfo);
     
      });
    },
    beforeAvatarUpload(file) {
      /**image/gif,image/jpeg,image/jpg,image/png,image/svg */
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/svg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、PNG、GIF、SVG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    onSubmit(formName) {
      if (this.editBtn === "提交") {
        this.fullloading = true;
        var _this = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.hrInfo.password === this.hrInfo.repeatPass) {
              this.updateHrUserInfo();
            } else {
              Message.error({
                message: "两次输入的密码不一致！"
              });
            }
          } else {
            Message.error({
              message: "填写信息有误！请重新填写！"
            });
            this.isEdit = false;
            this.editBtn = "提交";
          }
        });
      } else {
        this.isEdit = !this.isEdit;
        this.editBtn = this.editBtn === "提交" ? "编辑" : "提交";
        this.updateInfo = this.editBtn === "提交" ? true : false;
      }
    },

    /**
     * 取消编辑
     */
    cancelEdit() {
      this.isEdit = true;
      this.editBtn = "编辑";
      this.fetchPassword();
      this.updateInfo = false;
      this.hrInfo = JSON.parse(JSON.stringify(this.$store.state.userInfo));
    }
  },
  computed: {
    headers(){
      return {
        'x-access-token':this.$store.state.user,
      }
    }
  },
  watch: {
    hrInfo: {
      handler() {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
