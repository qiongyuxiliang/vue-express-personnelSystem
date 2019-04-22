<template>
  <div style="margin-top: 10px" v-loading="fullloading">
    <div style="margin-bottom: 10px;display: flex;justify-content: center;align-items: center">
      <el-input
        placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
        v-model="keywords"
      ></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
      <el-button
        style="margin-left:5%;"
        type="success"
        size="small"
        icon="el-icon-plus"
        @click="addHrDialogOpen"
      >添加管理员</el-button>
      <el-dialog
        title="增加新的管理员"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        width="68%"
        style="padding: 0px;"
      >
        <el-form
          :model="hrInfo"
          :rules="rules"
          ref="addHr"
          style="margin: 0px;padding: 0px;border-radius:12px;"
        >
          <el-row>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="姓名:" prop="name">
                  <el-input
                    autofocus='true'
                    prefix-icon="el-icon-edit"
                    v-model="hrInfo.name"
                    size="mini"
                    style="width: 160px"
                    placeholder="请输入管理员姓名"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="手机号:" prop="phone">
                  <el-input
                    prefix-icon="el-icon-mobile-phone"
                    v-model="hrInfo.phone"
                    size="mini"
                    style="width: 160px"
                    placeholder="请输入管理员手机号"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="座机号:" prop="telephone">
                  <el-input
                    prefix-icon="el-icon-phone"
                    v-model="hrInfo.telephone"
                    size="mini"
                    style="width: 160px"
                    placeholder="请输入管理员座机号"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="地址:" prop="address">
                  <el-input
                    prefix-icon="el-icon-location"
                    v-model="hrInfo.address"
                    size="mini"
                    style="width: 160px"
                    placeholder="请输入管理员地址"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="用户状态:" prop="userState">
                  <el-radio-group v-model="hrInfo.userState">
                    <el-radio label="禁用" >禁用</el-radio>
                    <el-radio style="margin-left: 10px" label="启用">启用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8" :offset="2">
              <div style="text-align: left">
                <el-form-item label="用户角色:" prop="allRoles">
                  <el-select
                    multiple
                    v-model="hrInfo.roleValue"
                    style="width: 160px"
                    size="mini"
                    placeholder="请选择角色"
                  >
                    <el-option
                      v-for="item in allRoles"
                      :key="item.id"
                      :label="item.nameZh"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="账号:" prop="username">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="hrInfo.username"
                    size="mini"
                    style="width: 160px"
                    placeholder="设置登录的账号"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: left">
                <el-form-item label="登录密码:" prop="password">
                  <el-input
                    prefix-icon="el-icon-edit-outline"
                    v-model="hrInfo.password"
                    size="mini"
                    style="width: 160px"
                    placeholder="设置初始密码"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <div style="text-align: left">
                <el-form-item label="备注信息:" prop="remarks">
                  <el-input
                    style="margin-left:7%;"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="hrInfo.remarks"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitHr('addHr')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card
        style="width: 350px;margin-bottom: 20px"
        v-for="(item,index) in hrs"
        :key="item.id"
        v-loading="cardLoading[index]"
      >
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
          <el-button
            type="text"
            style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
            icon="el-icon-delete"
            @click="deleteHr(item.id)"
          ></el-button>
        </div>
        <div>
          <div style="width: 100%;display: flex;justify-content: center">
            <img
              :src="item.userface"
              alt="item.name"
              style="width: 70px;height: 70px;border-radius: 70px"
            >
          </div>
          <div style="margin-top: 20px">
            <div>
              <span class="user-info">用户名:{{item.name}}</span>
            </div>
            <div>
              <span class="user-info">手机号码:{{item.phone}}</span>
            </div>
            <div>
              <span class="user-info">电话号码:{{item.telephone}}</span>
            </div>
            <div>
              <span class="user-info">地址:{{item.address}}</span>
            </div>
            <div
              class="user-info"
              style="display: flex;align-items: center;margin-bottom: 3px"
            >用户状态:
              <el-switch
                style="display: inline;margin-left: 5px"
                v-model="item.enabled"
                active-color="#13ce66"
                inactive-color="#aaaaaa"
                active-text="启用"
                :key="item.id"
                @change="switchChange(item.enabled,item.id,index)"
                inactive-text="禁用"
              ></el-switch>
            </div>
            <div class="user-info">用户角色:
              <el-tag
                v-for="role in item.roles"
                :key="role.id"
                type="success"
                size="mini"
                style="margin-right: 5px"
                :disable-transitions="false"
              >{{role.nameZh}}</el-tag>
              <el-popover
                v-loading="eploading[index]"
                placement="right"
                title="角色列表"
                width="200"
                @hide="updateHrRoles(item.id,index)"
                :key="item.id"
                trigger="click"
              >
                <el-select v-model="selRoles" multiple placeholder="请选择角色">
                  <el-option v-for="ar in allRoles" :key="ar.id" :label="ar.nameZh" :value="ar.id"></el-option>
                </el-select>
                <el-button
                  type="text"
                  icon="el-icon-more"
                  style="color: #09c0f6;padding-top: 0px"
                  slot="reference"
                  @click="loadSelRoles(item.roles,index)"
                  :disabled="moreBtnState"
                ></el-button>
                <!--                <i class="el-icon-more" style="color: #09c0f6;cursor: pointer" slot="reference" 
                @click="loadSelRoles(item.roles,index)" disabled="true"></i>-->
              </el-popover>
            </div>
            <div>
              <span class="user-info">备注:{{item.remark}}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: "",
      fullloading: false,
      hrs: [],
      cardLoading: [],
      eploading: [],
      allRoles: [],
      moreBtnState: false,
      selRoles: [],
      selRolesBak: [],
      dialogFormVisible: false,
      hrInfo: {
        name: "",
        telephone: "",
        userState: "",
        phone: "",
        address: "",
        roleValue: [],
        username: "",
        password: "123456",
        remarks: ""
      },
      rules: {
        name: [{ required: true, message: "必填:姓名", trigger: "blur" }],
        telephone: [{ required: false, trigger: "blur" }],
        address: [
          { required: true, message: "必填:用户的住址", trigger: "blur" }
        ],
        remarks: [{ required: false, trigger: "blur" }],
        username: [
          { required: true, message: "必填:用户登录账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "必填:初始密码", trigger: "blur" }
        ],
        roleValue: [
          { required: true, message: "必选:角色", trigger: "change" }
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
        ]
      }
    };
  },
  mounted: function() {
    this.initCards();
    this.loadAllRoles();
  },
  methods: {
    /**
     * 添加管理员
     */
    addHrDialogOpen() {
      this.dialogFormVisible = true;
    },
    /**
     * 初始化注册的Hr信息
     */
    emptyHrInfo(){
        this.hrInfo={
                name: "",
                telephone: "",
                userState: "",
                phone: "",
                address: "",
                roleValue: [],
                username: "",
                password: "123456",
                remarks: ""
              }
    },
    /**
     * 提交数据，创建新的用户
     */
    submitHr(formName) {
      this.fullloading = true;
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRequest("/system/hr/newHr", this.hrInfo).then(resp => {
            _this.fullloading = false;
            this.dialogFormVisible = false;
            if (resp && resp.status == 200) {
              this.emptyHrInfo();
              let data = resp.data;
              if (data.status == "success") {
                _this.initCards();
                _this.loadAllRoles();
              }
            }
          });
        }
      });
    },
    searchClick() {
      this.initCards();
      this.loadAllRoles();
    },
    updateHrRoles(hrId, index) {
      this.moreBtnState = false;
      var _this = this;
      if (this.selRolesBak.length == this.selRoles.length) {
        for (var i = 0; i < this.selRoles.length; i++) {
          for (var j = 0; j < this.selRolesBak.length; j++) {
            if (this.selRoles[i] == this.selRolesBak[j]) {
              this.selRolesBak.splice(j, 1);
              break;
            }
          }
        }
        if (this.selRolesBak.length == 0) {
          return;
        }
      }
      this.eploading.splice(index, 1, true);
      this.putRequest("/system/hr/roles", {
        hrId: hrId,
        rids: this.selRoles
      }).then(resp => {
        _this.eploading.splice(index, 1, false);

        if (resp && resp.status == 200) {
          var data = resp.data;
          if (data.status == "success") {
            _this.refreshHr(hrId, index);
          }
        }
      });
    },
    refreshHr(hrId, index) {
      var _this = this;
      _this.cardLoading.splice(index, 1, false);
      this.putRequest("/system/hr/id/" + hrId).then(resp => {
        _this.cardLoading.splice(index, 1, false);
        _this.hrs.splice(index, 1, resp.data);
      });
    },
    loadSelRoles(hrRoles, index) {
      this.moreBtnState = true;
      this.selRoles = [];
      this.selRolesBak = [];
      hrRoles.forEach(role => {
        this.selRoles.push(role.id);
        this.selRolesBak.push(role.id);
      });
    },
    loadAllRoles() {
      var _this = this;
      this.getRequest("/system/basic/roles").then(resp => {
        _this.fullloading = false;
        if (resp && resp.status == 200) {
          _this.allRoles = resp.data;
        }
      });
    },
    switchChange(newValue, hrId, index) {
      var _this = this;
      _this.cardLoading.splice(index, 1, true);
      this.putRequest("/system/hr/", {
        enabled: newValue,
        id: hrId
      }).then(resp => {
        _this.cardLoading.splice(index, 1, false);
        if (resp && resp.status == 200) {
          var data = resp.data;
          if (data.status == "error") {
            _this.refreshHr(hrId, index);
          }
        } else {
          _this.refreshHr(hrId, index);
        }
      });
    },
    initCards() {
      this.fullloading = true;
      var _this = this;
      var searchWords;
      if (this.keywords === "") {
        searchWords = "all";
      } else {
        searchWords = this.keywords;
      }
      this.getRequest("/system/hr/" + searchWords).then(resp => {
        if (resp && resp.status == 200) {
          _this.hrs = resp.data;
          _this.hrs.map(function(item){
              item.enabled=!!item.enabled;
          })
          var length = resp.data.length;
          _this.cardLoading = Array.apply(null, Array(length)).map(function(
            item,
            i
          ) {
            return false;
          });
          _this.eploading = Array.apply(null, Array(length)).map(function(
            item,
            i
          ) {
            return false;
          });
        }
      });
    },
    deleteHr(hrId) {
      var _this = this;
      this.fullloading = true;
      this.deleteRequest("/system/hr/" + hrId).then(resp => {
        _this.fullloading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          if (data.status == "success") {
            _this.initCards();
            _this.loadAllRoles();
          }
        }
      });
    }
  }
};
</script>
<style>
.user-info {
  font-size: 12px;
  color: #09c0f6;
}
</style>
