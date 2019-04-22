<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过员工名搜索员工,记得回车哦..."
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchEmp"
            prefix-icon="el-icon-search"
            v-model="keywords">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchEmp">搜索
          </el-button>
          <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                     @click="showAdvanceSearchView"><i
            class="fa fa-lg" v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"
            style="margin-right: 5px"></i>高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            action="/employee/basic/importEmployeFromExcel"
            :headers="tokenHeaders"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText=='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'"><i class="fa fa-lg fa-level-up"
                                                                                          style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportEmps"><i class="fa fa-lg fa-level-down"
                                                                       style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus"
                     @click="showAddEmpView">
            添加员工
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
              v-show="advanceSearchViewVisible">
              <el-row>
                <el-col :span="5">
                  政治面貌:
                  <el-select v-model="emp.politicId" style="width: 130px" size="mini" placeholder="政治面貌">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  民族:
                  <el-select v-model="emp.nationId" style="width: 130px" size="mini" placeholder="请选择民族">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  集团负责人职位:
                  <el-select v-model="emp.principalPosId" style="width: 150px" size="mini" placeholder="请选择职位">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  员工类别（职称）:
                  <el-select v-model="emp.jobLevelId" style="width: 130px" size="mini" placeholder="请选择职称">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  所属部门:
                  <el-popover
                    v-model="showOrHidePop2"
                    placement="right"
                    title="请选择部门"
                    trigger="manual">
                    <el-tree :data="deps" :default-expand-all="true" :props="defaultProps" :expand-on-click-node="false"
                             @node-click="handleNodeClick2"></el-tree>
                    <div slot="reference"
                         style="width: 130px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                         @click="showDepTree2" v-bind:style="{color: depTextColor}">{{emp.departmentName}}
                    </div>
                  </el-popover>
                </el-col>
                <!-- <el-col :span="7">
                  聘用形式:
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-col> -->
              </el-row>
              <el-row style="margin-top: 10px">
                
                <el-col :span="9" style="margin-left:-1.5%">
                  入职日期:
                  <el-date-picker
                    v-model="beginDateScope"
                    unlink-panels
                    size="mini"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="5" :offset="9">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchEmp">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="emps"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="left"
              width="30">
            </el-table-column>
            <el-table-column
              prop="name"
              align="left"
              fixed
              label="姓名"
              width="90">
            </el-table-column>
            <el-table-column
              prop="workID"
              width="120"
              align="left"
              label="工号"
              >
            </el-table-column>
            <el-table-column
              prop="gender"
              label="性别"
               align="left"
              width="50">
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              label="出生日期">
              <template slot-scope="scope">{{ scope.row.birthday | formatDate}}</template>
            </el-table-column>
            <el-table-column
              prop="idCard"
              width="160"
              align="left"
              label="身份证号码">
            </el-table-column>
            <el-table-column
              prop="wedlock"
              width="80"
              label="婚姻状况">
            </el-table-column>
            <el-table-column
              width="100"
              prop="nation.nationName"
              align="center"
              label="民族">
            </el-table-column>
            <el-table-column
              prop="nativePlace"
              width="80"
              label="籍贯">
            </el-table-column>
            <el-table-column
              prop="politicsStatus.poliName"
              label="政治面貌">
            </el-table-column>
            <el-table-column
              prop="email"
              width="180"
              align="left"
              label="电子邮件">
            </el-table-column>
            <el-table-column
              prop="phone"
              width="120"
              label="电话号码">
            </el-table-column>
            <el-table-column
              prop="liveAddr"
              width="220"
              align="left"
              label="联系地址">
            </el-table-column>
            <el-table-column
              prop="department.deName"
              align="left"
              width="140"
              label="所属部门">
            </el-table-column>
            <el-table-column
              width="140"
              align="left"
              prop="position.posName"
              label="集团负责人职位">
            </el-table-column>
            <el-table-column
              prop="jobLevel.jobName"
              width="100"
              align="left"
              label="职称">
            </el-table-column>
            <!-- <el-table-column
              prop="engageForm"
              label="聘用形式">
            </el-table-column> -->
            <el-table-column
              width="100"
              align="left"
              label="入职日期">
              <template slot-scope="scope">{{ scope.row.atComponyDate | formatDate}}</template>
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              label="转正日期">
              <template slot-scope="scope">{{ scope.row.conversionTime | formatDate}}</template>
            </el-table-column>
            <el-table-column
              width="110"
              align="left"
              label="合同起始日期">
              <template slot-scope="scope">{{ scope.row.beginContract | formatDate}}</template>
            </el-table-column>
            <el-table-column
              width="110"
              align="left"
              label="合同截至日期">
              <template slot-scope="scope">{{ scope.row.endContract | formatDate}}</template>
            </el-table-column>
            <el-table-column
              align="left"
              width="130"
              label="距离合同到期天数">
              <template slot-scope="scope">{{ scope.row.toEndcontractDays}}天</template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="tiptopDegree"
              label="最高学历">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="220">
              <template slot-scope="scope" >
                <el-button @click="showEditEmpView(scope.row)" style="padding: 3px 4px 3px 4px;"
                           size="mini">编辑
                </el-button>
                <el-button style="padding: 3px 4px 3px 4px;margin: 2px" type="primary"
                           size="mini">查看高级资料
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteEmp(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="emps.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyEmps">批量删除
            </el-button>
            <el-pagination
              background
              :page-size="10"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form :model="emp" :rules="rules" ref="addEmpForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="90%">
          <el-row>
            <el-col :span="5">
              <div>
                
                <el-form-item label="集团:" prop="conName">
                  <el-select v-model="emp.conglomerateId" style="width: 140px" size="mini" placeholder="所属集团">
                    <el-option
                      v-for="item in conglomerateInfo"
                      :key="item.id"
                      :label="item.conglomerateName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                   <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                    v-model="showOrHidePop"
                    placement="right"
                    title="请选择部门"
                    trigger="manual">
                    <el-tree :data="deps" :default-expand-all="true" :props="defaultProps" :expand-on-click-node="false"
                             @node-click="handleNodeClick"></el-tree>
                    <div slot="reference"
                         style="width: 150px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                         @click.left="showDepTree" v-bind:style="{color: depTextColor}">{{emp.departmentName}}
                    </div>
                  </el-popover>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                  <el-form-item label="集团负责人职位:" prop="posNameId">
                  <el-select v-model="emp.principalPosId" style="width: 150px" size="mini" placeholder="请选择职位">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                  <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.name" size="mini" style="width: 150px"
                            placeholder="请输入员工姓名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" style="width: 200px" size="mini" placeholder="政治面貌">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-col>
             <el-col :span="4">
              <div>
                  <el-form-item label="笔名:" prop="penName">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.penName" size="mini" style="width: 150px"
                            placeholder="请输入员工笔名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" style="width: 150px" size="mini" placeholder="请选择民族">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <div>
                <el-form-item label="曾用名:" prop="extName">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.extName" size="mini" style="width: 150px"
                            placeholder="请输入员工曾用名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input v-model="emp.nativePlace" size="mini" style="width: 120px" placeholder="员工籍贯"></el-input>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    value-format="yyyy-MM-dd "
                    style="width: 150px"
                    type="date"
                    placeholder="出生日期">
                  </el-date-picker>
                </el-form-item>
               
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="身份证号码:" prop="idCard">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.idCard" size="mini" style="width: 180px"
                            placeholder="请输入员工身份证号码..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="联系地址:" prop="address">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.address" size="mini" style="width: 200px"
                            placeholder="联系地址..."></el-input>
                </el-form-item> -->
              </div>
            </el-col>
             <el-col :span="5">
              <div>
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 15px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
          
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="员工状态:" prop="workState">
                  <el-radio-group v-model="emp.workState">
                    <el-radio label="在职">在职</el-radio>
                    <el-radio style="margin-left: 15px" label="离职">离职</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" style="width: 120px" size="mini" placeholder="请选择职称">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <div>
                 <el-form-item label="员工类别:" prop="jobLevel">
                  <el-select v-model="emp.posId" style="width: 120px" size="mini" placeholder="请选择职称">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                    v-model="showOrHidePop"
                    placement="right"
                    title="请选择部门"
                    trigger="manual">
                    <el-tree :data="deps" :default-expand-all="true" :props="defaultProps" :expand-on-click-node="false"
                             @node-click="handleNodeClick"></el-tree>
                    <div slot="reference"
                         style="width: 150px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                         @click.left="showDepTree" v-bind:style="{color: depTextColor}">{{emp.departmentName}}
                    </div>
                  </el-popover>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
                <el-form-item label="担任本职位日期:" prop="atPosDays">
                  <el-date-picker
                    v-model="emp.atPosDays"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="单人本职位日期">
                  </el-date-picker>
                </el-form-item>
              <!-- <div>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input prefix-icon="el-icon-phone" v-model="emp.phone" size="mini" style="width: 200px"
                            placeholder="电话号码..."></el-input>
                </el-form-item>
              </div> -->
            </el-col>
             <el-col :span="5">
              <div>
                 <el-form-item label="试用期:" prop="probationPeriod">
                        <el-date-picker
                        v-model="emp.probationP"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"  size="mini" style="width: 210px">
                </el-date-picker>
              </el-form-item>
                <!-- <el-form-item label="工号:" prop="workID">
                  <el-input v-model="emp.workID" disabled size="mini" style="width: 150px"
                            placeholder="员工工号..."></el-input>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="手机号:" prop="phone">
                  <el-input prefix-icon="el-icon-phone" v-model="emp.phone" size="mini" style="width: 200px"
                            placeholder="手机号码..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" style="width: 120px" size="mini" placeholder="最高学历">
                    <el-option
                      v-for="item in degrees"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="工作手机号:" prop="workPhone">
                  <el-input prefix-icon="el-icon-phone" v-model="emp.workPhone" size="mini" style="width: 140px"
                            placeholder="工作手机号码..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="毕业院校:" prop="school">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.school" size="mini" style="width: 150px"
                            placeholder="毕业院校名称"></el-input>
                </el-form-item> -->
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                 <el-form-item label="分机号:" prop="extPhone">
                  <el-input prefix-icon="el-icon-phone" v-model="emp.extPhone" size="mini" style="width: 200px"
                            placeholder="分机号..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="专业名称:" prop="specialty">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini" style="width: 200px"
                            placeholder="专业名称"></el-input>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="QQ号:" prop="qq_num">
                  <el-input prefix-icon="el-icon-phone" v-model="emp.qq_num" size="mini" style="width: 200px"
                            placeholder="QQ号..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd "
                    placeholder="入职日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="电子邮箱:" prop="email">
                  <el-input prefix-icon="el-icon-message" v-model="emp.email" size="mini" style="width: 150px"
                            placeholder="电子邮箱地址..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    style="width: 130px"
                    value-format="yyyy-MM-dd "
                    type="date"
                    placeholder="转正日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="婚姻" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio style="margin-left: 15px" label="未婚"></el-radio>
                    <el-radio style="margin-left: 15px" label="离异"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    value-format="yyyy-MM-dd "
                    style="width: 135px"
                    type="date"
                    placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" style="width: 150px" size="mini" placeholder="请选择民族">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="合同终止日期:" prop="endContract">
                  <el-date-picker
                    v-model="emp.endContract"
                    value-format="yyyy-MM-dd "
                    size="mini"
                    style="width: 135px"
                    type="date"
                    placeholder="合同终止日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                <el-form-item label="年龄:" prop="age">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.age" size="mini" style="width: 200px"
                            placeholder="年龄"></el-input>
                </el-form-item>
                <!-- <el-form-item label="专业名称:" prop="specialty">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini" style="width: 200px"
                            placeholder="专业名称"></el-input>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="工龄:" prop="workAge">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.workAge" size="mini" style="width: 200px"
                            placeholder="工龄"></el-input>
                </el-form-item>
                <!-- <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd "
                    placeholder="入职日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="异动日期:" prop="transDate">
                  <el-date-picker
                    v-model="emp.transDate"
                    size="mini"
                    style="width: 130px"
                    value-format="yyyy-MM-dd "
                    type="date"
                    placeholder="异动日期">
                  </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    style="width: 130px"
                    value-format="yyyy-MM-dd "
                    type="date"
                    placeholder="转正日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="户口性质" prop="accountPro">
                  <el-radio-group v-model="emp.accountPro">
                    <el-radio label="农村">农村</el-radio>
                    <el-radio style="margin-left: 15px" label="城市"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    value-format="yyyy-MM-dd "
                    style="width: 135px"
                    type="date"
                    placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item> -->
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                 <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.nativePlace" size="mini" style="width: 200px"
                            placeholder="籍贯"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                <el-form-item label="户口住址:" prop="accountAddr">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.accountAddr" size="mini" style="width: 200px"
                            placeholder="户口住址"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="现住址:" prop="liveAddr">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.liveAddr" size="mini" style="width: 200px"
                            placeholder="现住址"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" style="width: 120px" size="mini" placeholder="最高学历">
                    <el-option
                      v-for="item in degrees"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="毕业院校:" prop="school">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.school" size="mini" style="width: 150px"
                            placeholder="毕业院校名称"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini" style="width: 130px"
                            placeholder="专业名称"></el-input>
                </el-form-item>
               
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                 <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" style="width: 200px" size="mini" placeholder="政治面貌">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="入司日期:" prop="atComponyDate">
                  <el-date-picker
                    v-model="emp.atComponyDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd "
                    placeholder="入司日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
              <el-form-item label="合同日期:" prop="contractTime">
                  <el-date-picker
                        v-model="emp.contractTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"  size="mini" style="width: 200px">
                </el-date-picker> 
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="距离合同到期天数:" prop="toEndcontractDays">
                  <el-input  v-model="emp.toEndcontractDays" size="mini" style="width: 100px"
                            ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
              <el-form-item label="续签合同:" prop="continueContract">
                  <el-date-picker
                        v-model="emp.continueContract"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" size="mini" style="width: 160px" >
                </el-date-picker> 
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                 <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd "
                    placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="保密协议:" prop="nda">
                  <el-radio-group v-model="emp.nda">
                    <el-radio :label="1">是</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="社保:" prop="socialSecurity">
                  <el-radio-group v-model="emp.socialSecurity">
                    <el-radio :label="1">已购买</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">放弃</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="竞业限制协议:" prop="compePro">
                  <el-radio-group v-model="emp.compePro">
                    <el-radio :label="1">已签订</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未签订</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="担保协议:" prop="assurePro">
                  <el-radio-group v-model="emp.assurePro">
                    <el-radio :label="1">已签订</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未签订</el-radio>
                  </el-radio-group>
                </el-form-item>
                
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
               <el-form-item label="弃权商业保险协议:" prop="dropCommercePro">
                  <el-radio-group v-model="emp.dropCommercePro">
                    <el-radio :label="1">已签订</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未签订</el-radio>
                  </el-radio-group >
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
             <el-form-item label="身份证复印件:" prop="idCarCopy">
                  <el-radio-group v-model="emp.idCarCopy">
                    <el-radio :label="1">已提供</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未提供</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="学历证:" prop="degree">
                  <el-radio-group v-model="emp.degree">
                    <el-radio :label="1">已提供</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未提供</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="一寸照片:" prop="photo">
                  <el-radio-group v-model="emp.photo">
                    <el-radio :label="1">已提供</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未提供</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                 <el-form-item label="离职证明:" prop="employSepCerti">
                  <el-radio-group v-model="emp.employSepCerti">
                    <el-radio :label="1">已提供</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未提供</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
           
            <el-col :span="5">
              <div>
                <el-form-item label="体检报告:" prop="bodyExamin">
                  <el-radio-group v-model="emp.bodyExamin">
                    <el-radio :label="1">已提供</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">未提供</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                 <el-form-item label="是否领取合同:" prop="isGetContract">
                  <el-radio-group v-model="emp.isGetContract">
                    <el-radio :label="1">是</el-radio>
                    <el-radio style="margin-left: 15px" :label="0">否</el-radio>
                  </el-radio-group>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="工资卡卡号:" prop="wageCard">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.wageCard" size="mini" style="width: 180px"
                            placeholder="请输入员工工资卡卡号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="开户行地址:" prop="wCardAddr">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.wCardAddr" size="mini" style="width: 180px"
                            placeholder="请输入开户行地址..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="新参保卡号:" prop="xcbCard">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.xcbCard" size="mini" style="width: 160px"
                            placeholder="请输入员工卡号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <div>
               <el-form-item label="开户行地址:" prop="xcbAddr">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.xcbAddr" size="mini" style="width: 180px"
                            placeholder="请输入开户行地址..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
               <el-form-item label="工号:" prop="workID">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.workID" size="mini" style="width: 180px"
                           ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div>
                <el-form-item label="备注:" prop="comments">
                    <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="emp.comments"  size="mini" style="width: 80%">
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="cancelEidt">取 消</el-button>
    <el-button size="mini" type="primary" @click="addEmp('addEmpForm')">确 定</el-button>
  </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
/**设置token值 */
 var  token =  JSON.parse(localStorage.getItem('x-access-token')) // 要保证取到
  export default {
    data() {
      return {
        tokenHeaders: {'x-access-token': token},
        emps: [],
        keywords: '',
        fileUploadBtnText: '导入数据',
        beginDateScope: '',
        faangledoubleup: 'fa-angle-double-up',
        faangledoubledown: 'fa-angle-double-down',
        dialogTitle: '',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        nations: [],
        politics: [],
        positions: [],
        joblevels: [],
        totalCount: -1,
        currentPage: 1,
        degrees: [{id: 4, name: '大专'}, {id: 5, name: '本科'}, {id: 6, name: '硕士'}, {id: 7, name: '博士'}, {
          id: 3,
          name: '高中'
        }, {id: 2, name: '初中'}, {id: 1, name: '小学'}, {id: 8, name: '其他'}],
        deps: [],
        defaultProps: {
          label: 'name',
          isLeaf: 'leaf',
          children: 'children'
        },
        dialogVisible: false,
        tableLoading: false,
        advanceSearchViewVisible: false,
        showOrHidePop: false,
        showOrHidePop2: false,
        conglomerateInfo:'',
        emp: {
          conglomerateId:'',
          nda:'',
          name: '',
          penName:'',
          extName:'',
          gender: '',
          birthday: '',
          idCard: '',
          wedlock: '',
          nationId: '',
          nativePlace: '',
          politicId: '',
          principalPosId:'',
          email: '',
          phone: '',
          address: '',
          departmentId: '',
          departmentName: '所属部门...',
          jobLevelId: '',
          posId: '',
          position:'',
          engageForm: '',
          tiptopDegree: '',
          specialty: '',
          school: '',
          beginDate: '',
          workState: '',
          workID: '',
          contractTerm: '',
          conversionTime: '',
          notWorkDate: '',
          beginContract: '',
          endContract: '',
          workAge: '',
          conglomerate:'',
          accountPro:'',
          continueContract:'',
        },
        rules: {
           /**
           * arr = [{nda:emp.nda},
           * {socialSecurity:emp.socialSecurity},
           * {compePro:emp.compePro},
           * {assurePro:emp.assurePro},
           * {dropCommercePro:emp.dropCommercePro},
            {idCarCopy:emp.idCarCopy},
            {degree:emp.degree},
            {photo:emp.photo},
            {employSepCerti:emp.employSepCerti},
            {isGetContract:emp.isGetContract},
            {bodyExamin:emp.bodyExamin}];
           */
          nda: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          socialSecurity: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          compePro: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          assurePro: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          dropCommercePro: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          idCarCopy: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          degree: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          photo: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          employSepCerti: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          isGetContract: [{required: true, message: '必选:请选择', trigger: 'blur'}],
          bodyExamin: [{required: true, message: '必选:请选择', trigger: 'blur'}],


          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          gender: [{required: true, message: '必填:性别', trigger: 'blur'}],
          birthday: [{required: true, message: '必填:出生日期', trigger: 'blur'}],
          idCard: [{
            required: true,
            message: '必填:身份证号码',
            trigger: 'blur'
          }, {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '身份证号码格式不正确',
            trigger: 'blur'
          }],
          wedlock: [{required: true, message: '必填:婚姻状况', trigger: 'blur'}],
          nationId: [{required: true, message: '必填:民族', trigger: 'change'}],
          nativePlace: [{required: true, message: '必填:籍贯', trigger: 'blur'}],
          politicId: [{required: true, message: '必填:政治面貌', trigger: 'blur'}],
          email: [{required: true, message: '必填:电子邮箱', trigger: 'blur'}, {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }],
          phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
          address: [{required: true, message: '必填:联系地址', trigger: 'blur'}],
          departmentId: [{required: true, message: '必填:部门', trigger: 'change'}],
          jobLevelId: [{required: true, message: '必填:职称', trigger: 'change'}],
          posId: [{required: true, message: '必填:职位', trigger: 'change'}],
          engageForm: [{required: true, message: '必填:聘用形式', trigger: 'blur'}],
          tiptopDegree: [{required: true, message: '必填:最高学历', trigger: 'change'}],
          specialty: [{required: true, message: '必填:专业', trigger: 'blur'}],
          workID: [{required: true, message: '必填:工号', trigger: 'blur'}],
          school: [{required: true, message: '必填:毕业院校', trigger: 'blur'}],
          beginDate: [{required: true, message: '必填:入职日期', trigger: 'blur'}],
          conversionTime: [{required: true, message: '必填:转正日期', trigger: 'blur'}],
          beginContract: [{required: true, message: '必填:合同起始日期', trigger: 'blur'}],
          endContract: [{required: true, message: '必填:合同终止日期', trigger: 'blur'}],
          workAge: [{required: true, message: '必填:工龄', trigger: 'blur'}]
        }
      };
    },
    mounted: function () {
      this.initData();
      this.loadEmps();
    },
    methods: {
      fileUploadSuccess(response, file, fileList){
        if (response) {
          this.$message({type: response.status, message: response.msg});
        }
        this.loadEmps();
        this.fileUploadBtnText = '导入数据';
      },
      fileUploadError(err, file, fileList){
        this.$message({type: 'error', message: "导入失败!"});
        this.fileUploadBtnText = '导入数据';
      },
      beforeFileUpload(file){
        this.fileUploadBtnText = '正在导入';
      },
      exportEmps(){
        /**添加headers,token */
         let token = JSON.parse(localStorage.getItem('x-access-token'));
        window.open("/employee/basic/getEmployeInfoToExcel?page=" + this.currentPage + "&size=10&keywords=" + this.keywords + "&politicId=" + this.emp.politicId + "&nationId=" + this.emp.nationId + "&posId=" + this.emp.posId + "&jobLevelId=" + this.emp.jobLevelId + "&engageForm=" + this.emp.engageForm + "&departmentId=" + this.emp.departmentId + "&beginDateScope=" + this.beginDateScope+"&x-access-token="+token, "_parent");
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyEmpData();
        this.beginDateScope = '';
        this.loadEmps();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyEmpData();
          this.beginDateScope = '';
          this.loadEmps();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyEmps(){
        this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = '';
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        }).catch(() => {
        });
      },
      deleteEmp(row){
        this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
        });
      },
      doDelete(ids){
        this.tableLoading = true;
        var _this = this;
        this.deleteRequest("/employee/basic/deleteEmploye/" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.loadEmps();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadEmps();
        }
      },
      searchEmp(){
        this.loadEmps();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadEmps();
      },
      loadEmps(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/employee/basic/emp?page=" + this.currentPage + "&size=10&keywords=" + this.keywords + "&politicId=" + this.emp.politicId + "&nationId=" + this.emp.nationId + "&principalPosId=" + this.emp.principalPosId + "&jobLevelId=" + this.emp.jobLevelId + "&engageForm=" + this.emp.engageForm + "&departmentId=" + this.emp.departmentId + "&beginDateScope=" + this.beginDateScope).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.emps = data.emps;
            _this.totalCount = data.count;
//            _this.emptyEmpData();
          }
        })
      },
      addEmp(formName){
        var _this = this;
       
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.emp.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/employee/basic/updateEmployeInfo", this.emp).then(resp=> {
               
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.dialogVisible = false;
                  _this.emptyEmpData();
                  _this.loadEmps();
                }
              })
            } else {
              // 添加
               console.log(this.emp)
              
              this.tableLoading = true;
              this.postRequest("/employee/basic/addNewEmploye", this.emp).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.dialogVisible = false;
                  _this.emptyEmpData();
                  _this.loadEmps();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.emptyEmpData();
      },
      showDepTree(){
        this.showOrHidePop = !this.showOrHidePop;
      },
      showDepTree2(){
        this.showOrHidePop2 = !this.showOrHidePop2;
      },
      handleNodeClick(data) {
        this.emp.departmentName = data.name;
        this.emp.departmentId = data.id;
        this.showOrHidePop = false;
        this.depTextColor = '#606266';
      },
      handleNodeClick2(data) {
        this.emp.departmentName = data.name;
        this.emp.departmentId = data.id;
        this.showOrHidePop2 = false;
        this.depTextColor = '#606266';
      },
      initData(){
        var _this = this;
        this.getRequest("/employee/basic/basicdata").then(resp=> {
          if (resp && resp.status == 200) {
            // console.log(resp)
            var data = resp.data.data;
            _this.nations = data.nations;
            _this.politics = data.politics;
            _this.deps = data.deps;
            _this.positions = data.positions;
            _this.joblevels = data.joblevels;
            _this.conglomerateInfo = data.conglomerateInfo;
            // _this.emp.workID = data.workID;
          }
        })
      },
      showEditEmpView(row){
        console.log(row)
        this.dialogTitle = "编辑员工";
        this.emp = row;
        this.emp.birthday = this.formatDate(row.birthday);
        this.emp.atPosDays  = this.formatDate(row.atPosDays);
        this.emp.conversionTime = this.formatDate(row.conversionTime);
        this.emp.beginContract = this.formatDate(row.beginContract);
        this.emp.endContract = this.formatDate(row.endContract);
        this.emp.beginDate = this.formatDate(row.beginDate);
        this.emp.transDate = this.formatDate(row.transDate);
        this.emp.atComponyDate = this.formatDate(row.atComponyDate);
        this.emp.continueContractSt = this.formatDate(row.continueContractSt);
        this.emp.continueContractEd = this.formatDate(row.continueContractEd);
        this.emp.contractTime = [this.emp.beginContract,this.emp.endContract]
        this.emp.probationP=[this.formatDate(row.probationPeriod.split(',')[0]),this.formatDate(row.probationPeriod.split(',')[1])]
        // this.emp.nationId = row.nation.id;
        // this.emp.politicId = row.politicsStatus.id;
        // this.emp.departmentId = row.department.id;
        this.emp.departmentName = row.department.deName;
        // this.emp.nda=row.nda=='0'?'否':'是';
        // this.emp.socialSecurity=row.socialSecurity=='1'?'已购买':'放弃';
        // this.emp.compePro=row.compePro=='1'?'已签订':'未签订';
        // this.emp.assurePro=row.assurePro==1?'已签订':'未签订';
        // this.emp.dropCommercePro=row.dropCommercePro==1?'已签订':'未签订';
        // this.emp.idCarCopy=row.idCarCopy==1?'已提供':'未提供';
        // this.emp.degree=row.degree==1?'已提供':'未提供';
        // this.emp.photo=row.photo==1?'已提供':'未提供';
        // this.emp.employSepCerti=row.employSepCerti==1?'已提供':'未提供';
        // this.emp.bodyExamin=row.bodyExamin==1?'已提供':'未提供';
        // this.emp.isGetContract=row.isGetContract==1?'是':'否';
        
        // this.emp.jobLevelId = row.jobLevel.id;
        // this.emp.posId = row.position.id;
//        delete this.emp.department;
//        delete this.emp.jobLevel;
//        delete this.emp.position;
//        delete this.emp.nation;
//        delete this.emp.politicsStatus;
        // delete this.emp.workAge;
        delete this.emp.notWorkDate;
        this.dialogVisible = true;
        
      },
      showAddEmpView(){
        this.emptyEmpData();
        this.dialogTitle = "添加员工";
        this.dialogVisible = true;
        var _this = this;
        this.getRequest("/employee/basic/maxWorkID").then(resp=> {
          if (resp && resp.status == 200) {
            _this.emp.workID = resp.data.maxWorkId;
          }
        })
      },
      emptyEmpData(){
        this.emp = {
         principalPosId:'',
          nda: '',
          socialSecurity: '',
          compePro: '',
          assurePro: '',
          dropCommercePro: '',
          idCarCopy: '',
          degree: '',
          photo: '',
          employSepCerti: '',
          isGetContract: '',
          bodyExamin: '',
          name: '',
          gender: '',
          birthday: '',
          workState:'',
          idCard: '',
          wedlock: '',
          nationId: '',
          nativePlace: '',
          politicId: '',
          email: '',
          phone: '',
          address: '',
          departmentId: '',
          departmentName: '所属部门...',
          jobLevelId: '',
          posId: '',
          engageForm: '',
          tiptopDegree: '',
          specialty: '',
          school: '',
          beginDate: '',
          workID: '',
          contractTerm: '',
          conversionTime: '',
          notWorkDate: '',
          beginContract: '',
          endContract: '',
          workAge: '',
          conglomerate:{
            conName:''
          },
          position:{
            posName:''
          }
        }
      }
    }
  };
</script>
<style>
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .el-table .cell{
    line-height: 24px;

}
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
