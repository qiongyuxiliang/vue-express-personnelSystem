/*jshint esversion: 6 */
function dealwithSearch(keywords, politicId, nationId, posId, jobLevelId, engageForm, departmentId, beginDateScope) {
    let querykeywords, querypoliticId, querynationId, queryprincipalPosId, queryjobLevelId, queryengageForm, querydepartmentId, querybeginDateScope;
    let startT = !!beginDateScope ? beginDateScope.split(',')[0] : '',
        endT = !!beginDateScope ? beginDateScope.split(',')[1] : '';
    querykeywords = !!keywords ? `and em.name like '%${keywords}%'` : ``;
    querypoliticId = !!politicId ? `and em.politicId=${politicId}` : ``;
    querynationId = !!nationId ? `and em.nationId=${nationId}` : ``;
    queryprincipalPosId = !!posId ? `and em.principalPosId=${posId}` : ``;
    queryjobLevelId = !!jobLevelId ? `and em.posId=${jobLevelId}` : ``;
    queryengageForm = !!engageForm ? `and em.engageForm='${engageForm}'` : ``;
    querydepartmentId = !!departmentId ? `and em.departmentId=${departmentId}` : ``;
    querybeginDateScope = !!beginDateScope ? `and em.atComponyDate between  DATE_FORMAT('${startT}','%Y-%m-%d')  and DATE_FORMAT('${endT}','%Y-%m-%d')` : ``;
    return `${querykeywords} ${querypoliticId} ${querynationId}  ${queryprincipalPosId}  ${queryjobLevelId}  ${queryengageForm}  ${querydepartmentId}  ${querybeginDateScope} `;
}
let sqlSentence = {
    searchUser: function (username, pass) {
        return `SELECT id FROM hr WHERE username='${username}' AND password='${pass}'`;
    },
    createNewUser: function (name, pass) {
        return "INSERT INTO hr (username,password)" +
            " VALUES" +
            " ('" + name + "','" + pass + "')";
    },
    userLogin: function (name, pass) {
        return "SELECT id" +
            " FROM " +
            " hr WHERE username='" + name + "' AND `password`='" + pass + "'";
    },
    /**
     * 获取menu菜单项
     */
    fetchMenue: function () {
        return "SELECT" +
            " m1.`id`," +
            "m1.`path`," +
            "m1.`component`," +
            "m1.`iconCls`," +
            "m1.`name`," +
            "m1.`requireAuth`," +
            "m1.`keepAlive`," +
            "m2.`component` AS component2," +
            "m2.`iconCls` AS iconCls2," +
            "m2.`keepAlive` AS keepAlive2," +
            "m2.`name` AS name2," +
            "m2.`path` AS path2," +
            "m2.`requireAuth` AS requireAuth2," +
            "m2.id AS id2" +
            " FROM" +
            " menu m1," +
            " menu m2" +
            " WHERE" +
            " m1.`id` = m2.`parentId`" +
            " AND m1.`id` != 1" +
            " and m2.`enabled`=1 order by m1.`id`,m2.`id`";
    },
    fetchMenue1: function (rid) {
        return `SELECT
        m1.id,
        m1.path,
        m1.component,
        m1.iconCls,
        m1.name,
        m1.requireAuth,
        m2.component AS component2,
        m2.iconCls AS iconCls2,
        m2.keepAlive AS keepAlive2,
        m2.name AS name2,
        m2.path AS path2,
        m2.requireAuth AS requireAuth2
    FROM
        menu m1,
        menu m2
    WHERE
        m1.id = m2.parentId
    AND m1.id != 1
    AND m2.id IN (
        SELECT
            mr.mid
        FROM
            hr_role h_r,
            menu_role mr
        WHERE
            h_r.rid = mr.rid
        AND h_r.hrid = ${rid})
        AND m2.enabled = TRUE
        ORDER BY
            m1.id,
            m2.id`;

    },
    /**
     * 获取管理员的信息
     */
    getLoginInfo: function (hrId) {
        return `SELECT
        h.*, r.id AS rid,
        r.name AS rname,
        r.nameZh AS rnameZh
        FROM
        (
            (
                hr h
                LEFT JOIN hr_role h_r ON ((h.id = h_r.hrid))
            )
            LEFT JOIN role r ON ((h_r.rid = r.id))
        )
        WHERE
        h.id = ${hrId}`;
    },
    /**
     * 
     * politicId = req.query.politicId,
        nationId = req.query.nationId,
        posId = req.query.posId,
        jobLevelId = req.query.jobLevelId,
        engageForm = req.query.engageForm,
        departmentId = req.query.departmentId,
        beginDateScope = req.query.beginDateScope;
     */
    /**
     * 获取员工的数量
     */
    getEmployNum: function (keywords, politicId, nationId, posId, jobLevelId, engageForm, departmentId, beginDateScope) {
        let query = dealwithSearch(keywords, politicId, nationId, posId, jobLevelId, engageForm, departmentId, beginDateScope);

        return `SELECT 
        COUNT(*) count 
        FROM employee em where 1=1 ${query}`;
    },
    /**
     * 获取员工的信息
     */
    getEmployeInfo: function (page, pageSize, keywords, politicId, nationId, principalPosId, jobLevelId, engageForm, departmentId, beginDateScope) {
        let query1 = dealwithSearch(keywords, politicId, nationId, principalPosId, jobLevelId, engageForm, departmentId, beginDateScope);
        return `SELECT
        em.*, de.id id1,
        de.isParent,
        de.enabled,
        de.depPath,
        de.parentId,
        de. NAME deName,
        job.id id2,
        job.createDate,
        job. NAME jobName,
        job.titleLevel,
        na.id id3,
        na. NAME nationName,
        poli.id id4,
        poli. NAME poliName,
        pos.id id5,
        pos.createDate posCreateDate,
        pos. NAME posName,
        con.id id6,
        con.createDate conCreateDate,
        con.conglomerateName conName
    FROM
        employee em
    LEFT JOIN department de ON em.departmentId = de.id
    LEFT JOIN joblevel job ON em.posId = job.id
    LEFT JOIN nation na ON em.nationId = na.id
    LEFT JOIN politicsstatus poli ON em.politicId = poli.id
    LEFT JOIN position pos ON em.principalPosId = pos.id
    LEFT JOIN conglomerate con ON em.conglomerateId = con.id
    WHERE
        1=1 ${query1}
    ORDER BY
        em.workID ASC
            LIMIT ${page},${pageSize}`;
    },
    /**
     * 
     * 获取导表所需员工信息
     */
    getEmployeInfoToExcel: function (keywords=0, politicId=0, nationId=0, posId=0, jobLevelId=0, engageForm=0, departmentId=0, beginDateScope=0) {
        let query = dealwithSearch(keywords, politicId, nationId, posId, jobLevelId, engageForm, departmentId, beginDateScope);
        return `SELECT
        em.workID,
        con.conglomerateName conName,
        dep.name deName,
        pos.name posName,
        em.name,
        em.penName,
        em.extName,
        em.birthday,
        em.idCard,
        em.gender,
        em.workState,
        job.name jobName,
        em.atPosDays,
        em.probationPeriod,
        em.phone,
        em.workPhone,
        em.extPhone,
        em.qq_num,
        em.email,
        em.wedlock,
        na.name naName,
        em.age,
        em.workAge,
        em.transDate,
        em.accountPro,
        em.nativePlace,
        em.liveAddr,
        em.accountAddr,
        em.tiptopDegree,
        em.school,
        em.specialty,
        poli.name poName,
        em.atComponyDate,
        em.beginContract,
        em.endContract,
        em.toEndcontractDays,
        em.continueContractSt,
        em.continueContractEd,
        em.conversionTime,
        em.nda,
        em.socialSecurity,
        em.compePro,
        em.dropCommercePro,
        em.assurePro,
        em.notWorkDate,
        em.idCarCopy,
        em.degree,
        em.photo,
        em.isGetContract,
        em.employSepCerti,
        em.bodyExamin,
        em.wageCard,
        em.wCardAddr,
        em.xcbCard,
        em.xcbAddr,
        em.comments
    FROM
        employee em,
        conglomerate con,
        department dep,
        position pos,
        joblevel job,
        -- posId
        nation na,
        politicsstatus poli
    WHERE dep.id=em.departmentId
    and con.id=em.conglomerateId
    and pos.id=em.principalPosId
    and na.id = em.nationId
    and poli.id=em.politicId
    and job.id = em.posId ${query}`;
    },
    /**
     * 获取用户的最大的workID
     */
    getMaxworkId: function (id) {
        return `SELECT workID from employee where id=(select max(id) from employee)`;
    },
    /**
     * 获取用户的职位
     */
    getEmployePosition: function () {
        return `SELECT * FROM position`;
    },
    /**
     * 获取员工的政治身份
     */
    getEmployePlotics: function () {
        return `SELECT id,name FROM politicsstatus`;
    },
    /**
     * 获取员工的民族
     */
    getEmployeNation: function () {
        return `SELECT id,name FROM nation`;
    },
    /**
     * 获取员工的jobLevel
     */
    getEmployeJoblevel: function () {
        return `SELECT * FROM joblevel`;
    },
    /**
     * 获取员工的部门
     */
    getEmployeDepartment: function () {
        return `SELECT * FROM department`;
    },
    /**
     * 增加新的员工
     */
    addNewEmploye: function (employee) {
        // let itemSql = !!workAge ? (`, workAge`) : ``;
        // let valueSql = !!workAge ? (`,'${workAge}'`) : ``;
        // let itemconversionTimeSql = !!conversionTime ? (`conversionTime,`) : ``;
        // let conversionTimeSql = !!conversionTime ? `DATE_FORMAT('${conversionTime}','%Y-%m-%d'),'` : ``;
        return `insert INTO employee (conglomerateId,departmentId,principalPosId,name,penName,extName,birthday,idCard,
            gender,workState,posId,atPosDays,probationPeriod,phone,workPhone,extPhone,qq_num,email,wedlock,nationId,
            age,workAge,transDate,accountPro,nativePlace,liveAddr,accountAddr,tiptopDegree,school,specialty,politicId,
            atComponyDate,beginContract,endContract,toEndcontractDays,continueContractSt,continueContractEd,conversionTime,
            nda,socialSecurity,compePro,dropCommercePro,assurePro,workID,idCarCopy,degree,photo,isGetContract,employSepCerti,
            bodyExamin,wCardAddr,xcbCard,wageCard,comments,xcbAddr
            )
            VALUES(
            '${employee.conglomerateId}','${employee.departmentId}','${employee.principalPosId}','${employee.name}','${employee.penName}',
            '${employee.extName}',DATE_FORMAT('${employee.birthday}','%Y-%m-%d'),'${employee.idCard}','${employee.gender}','${employee.workState}','${employee.posId}',
             DATE_FORMAT('${employee.atPosDays}','%Y-%m-%d'),'${employee.probationP}','${employee.phone}','${employee.workPhone}','${employee.extPhone}','${employee.qq_num}',
            '${employee.email}','${employee.wedlock}','${employee.nationId}','${employee.age}','${employee.workAge}','${employee.transDate}','${employee.accountPro}','${employee.nativePlace}',
            '${employee.liveAddr}','${employee.accountAddr}','${employee.tiptopDegree}','${employee.school}','${employee.specialty}','${employee.politicId}',DATE_FORMAT('${employee.atComponyDate}','%Y-%m-%d'),
            '${employee.beginContract}','${employee.endContract}','${employee.toEndcontractDays}','${employee.continueContractSt}','${employee.continueContractEd}',
             DATE_FORMAT('${employee.conversionTime}','%Y-%m-%d'),'${employee.nda}','${employee.socialSecurity}','${employee.compePro}','${employee.dropCommercePro}','${employee.assurePro}','${employee.workID}',
            '${employee.idCarCopy}','${employee.degree}','${employee.photo}','${employee.isGetContract}','${employee.employSepCerti}','${employee.bodyExamin}','${employee.wCardAddr}',
            '${employee.xcbCard}','${employee.wageCard}','${employee.comments}','${employee.xcbAddr}')`;
    },
    /**
     * 更新员工信息
     */
    updateEmployeInfo: function (employee) {
        let conversionTimeSql = !!employee.conversionTime ? `conversionTime = '${employee.conversionTime}',` : ``;
        let notWorkDateSql = !!employee.notWorkDate ? `notWorkDate = '${employee.notWorkDate}',` : ``;
        let workStateSql = !!employee.workState ? `workState = '${employee.workState}',` : ``;
        let sqlSen = !!employee.id?`id = ${employee.id}`:`workID='${employee.workID}'`;
        return `update employee SET
        conglomerateId='${employee.conglomerateId}',
        departmentId='${employee.departmentId}',
        principalPosId='${employee.principalPosId}',
        name='${employee.name}',
        penName='${employee.penName}',
        extName='${employee.extName}',
        birthday=DATE_FORMAT('${employee.birthday}','%Y-%m-%d'),
        idCard='${employee.idCard}',
        gender='${employee.gender}',
        workState='${employee.workState}',
        posId='${employee.posId}',
        atPosDays=DATE_FORMAT('${employee.atPosDays}','%Y-%m-%d'),
        probationPeriod='${employee.probationP}',
        phone='${employee.phone}',
        workPhone='${employee.workPhone}',
        extPhone='${employee.extPhone}',
        qq_num ='${employee.qq_num}',
        email='${employee.email}',
        wedlock='${employee.wedlock}',
        nationId='${employee.nationId}',
        age='${employee.age}',
        workAge='${employee.workAge}',
        transDate='${employee.transDate}',
        accountPro='${employee.accountPro}',
        nativePlace='${employee.nativePlace}',
        liveAddr='${employee.liveAddr}',
        accountAddr='${employee.accountAddr}',
        tiptopDegree='${employee.tiptopDegree}',
        school='${employee.school}',
        specialty='${employee.specialty}',
        politicId='${employee.politicId}',
        atComponyDate=DATE_FORMAT('${employee.atComponyDate}','%Y-%m-%d'),
        beginContract='${employee.beginContract}',
        endContract='${employee.endContract}',
        toEndcontractDays='${employee.toEndcontractDays}',
        continueContractSt='${employee.continueContractSt}',
        continueContractEd='${employee.continueContractEd}',
        conversionTime= DATE_FORMAT('${employee.conversionTime}','%Y-%m-%d'),
        nda='${employee.nda}',
        socialSecurity='${employee.socialSecurity}',
        compePro='${employee.compePro}',
        dropCommercePro='${employee.dropCommercePro}',
        assurePro='${employee.assurePro}',
        workID='${employee.workID}',
        idCarCopy='${employee.idCarCopy}',
        degree='${employee.degree}',
        photo='${employee.photo}',
        isGetContract='${employee.isGetContract}',
        employSepCerti='${employee.employSepCerti}',
        bodyExamin='${employee.bodyExamin}',
        wCardAddr='${employee.wCardAddr}',
        xcbCard='${employee.xcbCard}',
        wageCard='${employee.wageCard}',
        comments='${employee.comments}',
        xcbAddr='${employee.xcbAddr}'
        where ${sqlSen}`;
    },
    /**
     * 删除员工
     */
    deleteEmploye: function (ids) {
        return `DELETE FROM employee WHERE id IN (${ids})`;
    },
    /**
     * 关联数据的变换
     */
    changeDataThroughTables: function (conglomerateId, departmentId, principalPosId, posId, nationId,politicId) {
        /**
        *  na. NAME = '汉族'
            AND po. NAME = '中共党员'
            AND de. NAME = '财务部'
            AND job. NAME = '教授'
            AND pos. NAME = '技术总监'
            AND con.conglomerateName='天津美享'
        */
        return `SELECT
        con.id AS conglomerateId,
        na.id AS nationId,
        po.id AS politicId,
        de.id AS departmentId,
        job.id AS posId,
        pos.id AS principalPosId
    FROM
        conglomerate con,
        nation na,
        politicsstatus po,
        department de,
        joblevel job,
        position pos
    WHERE
			na. NAME = '${nationId}'
            AND po. NAME = '${politicId}'
            AND de. NAME = '${departmentId}'
            AND job. NAME = '${posId}'
            AND pos. NAME = '${principalPosId}'
            AND con.conglomerateName='${conglomerateId}'
`;
    },
    /**
     * 查找用户的workId是否存在
     */
    isExistEmployeWorkId: function (workId) {
        return `SELECT COUNT(*) count FROM employee WHERE workID='${workId}'`;
    },
    /**
     * 套账处理
     */
    getSlaryFDB: function () {
        return `SELECT * FROM salary;`
    },
    setSlaryFDB: function (salary) {
        return `insert into salary (bonus, lunchSalary,
            trafficSalary, basicSalary,
            pensionBase, pensionPer, createDate,
            medicalBase, medicalPer, accumulationFundBase,
            accumulationFundPer, name)
            values (salary.bonus, salary.lunchSalary,
            salary.trafficSalary, salary.basicSalary,
            salary.pensionBase, salary.pensionPer, salary.createDate,
            salary.medicalBase, salary.medicalPer, salary.accumulationFundBase,
            salary.accumulationFundPer, salary.name)`;
    },
    /**
     * 
     * 获取工资待遇的详情
     */
    getEmployeFDB: function (page, size) {
        return `SELECT
        emp. name,
        emp.workID,
        emp.email,
        emp.phone,
        de. NAME AS deName,
        sal. NAME AS sName,
        emp.id as id,
     sal.basicSalary as basicSalary_slary,
     sal.bonus as bonus_slary,
     sal.lunchSalary as lunchSalary_slary,
     sal.trafficSalary as trafficSalary_slary,
     sal.allSalary as allSalary_slary,
     sal.pensionBase as pensionBase_slary,
     sal.pensionPer as pensionPer_slary,
     sal.medicalBase as medicalBase_slary,
     sal.medicalPer as medicalPer_slary,
     sal.accumulationFundBase as accumulationFundBase_slary,
     sal.accumulationFundPer as accumulationFundPer_slary,
     sal.id as id_slary
    FROM
        employee emp,
        empsalary ems,
        salary sal,
        department de
    WHERE
        ems.sid = sal.id
    AND ems.eid = emp.id
    AND emp.departmentId = de.id
    limit ${page},${size}`;
    },
    /**
     * 获取员工对应账套的数量
     */
    getEmployeCount: function () {
        return `SELECT
        count(*) count
    FROM
        employee emp,
        empsalary ems,
        salary sal,
        department de
    WHERE
        ems.sid = sal.id
    AND ems.eid = emp.id
    AND emp.departmentId = de.id`
    },
    /**
     * 获取账套
     */
    getAccinformation: function () {
        return `SELECT
        sal.name,
        sal.id
    FROM
        salary sal
    `;
    },
    /**
     * 更新编辑员工账套
     */
    updateAccinformation: function (eid, sid, osid) {
        return `UPDATE empsalary
        SET sid =${sid}
        WHERE
            sid =${osid}
            and eid =${eid}`
    },
    /**
     * 添加账套
     */
    addSalary: function (salary) {
        return `INSERT INTO salary (
            createDate,
            basicSalary,
            trafficSalary,
            lunchSalary,
            bonus,
            pensionBase,
            pensionPer,
            medicalBase,
            medicalPer,
            accumulationFundBase,
            accumulationFundPer,
            name
        )
        VALUES
            ('${salary.createDate}',${salary.basicSalary},
             ${salary.trafficSalary},${salary.lunchSalary},
             ${salary.bonus},${salary.pensionBase},
             ${salary.pensionPer},${salary.medicalBase},
             ${salary.medicalPer},${salary.accumulationFundBase},
             ${salary.accumulationFundPer},'${salary.name}')`
    },
    /**
     * 删除账套
     */
    deleteSalary: function (ids) {
        return `DELETE FROM salary WHERE id IN (${ids})`;
    },
    /**
     * 更新账套 
     */
    updateSalary: function (salary) {
        return `UPDATE salary
        SET createDate = DATE_FORMAT('${salary.createDate}','%Y-%m-%d'), basicSalary = ${salary.basicSalary},
        trafficSalary = ${salary.trafficSalary}, lunchSalary = ${salary.lunchSalary}, 
        bonus = ${salary.bonus}, pensionBase = ${salary.pensionBase},
        pensionPer = ${salary.pensionPer},
        medicalBase=${salary.medicalBase},medicalPer=${salary.medicalPer},accumulationFundBase=${salary.accumulationFundBase},
        accumulationFundPer=${salary.accumulationFundPer},name='${salary.name}'
        WHERE id=${salary.id}`;
    },
    /**
     * 用户权限管理
     */
    getPositions: function () {
        return `SELECT * FROM position`;
    },
    getJobLevels: function () {
        return `SELECT * FROM joblevel`;
    },
    getRoles: function () {
        return `SELECT * FROM role`;
    },
    getRoleMenu: function (rid) {
        return ` SELECT mid from menu_role WHERE rid=${rid}`;
    },
    /**
     * 添加权限和删除用户角色的权限。即更新用户的权限,添加和刪除多個
     */
    deleteMenuByRid: function (mid) {
        return `DELETE FROM menu_role WHERE mid in ${mid}`;
    },
    addMenuByRid: function (sqlArr) {
        return `INSERT INTO menu_role(mid,rid) VALUES ${sqlArr}`;
    },
    /**
     * 获取各个部门
     */
    getDepartment: function () {
        return `SELECT id,name,parentId,enabled,isParent from department WHERE enabled=true`;
    },
    /**
     * 添加和删除部门
     */
    addDepartment: function (depName, parentId, enabled = true) {
        return `call addDep(${depName},${parentId},${enabled},@a,@b)`;
    },
    /**
     * 獲取最近的id
     */
    addDepRencetId: function () {
        return `select MAX(id) from department`;
    },
    deleteDepartment: function (did) {
        return `call deleteDep(${did},@aa)`;
    },
    /**
     *獲取管理員信息 
     */
    managerInfoAndAuthor: function (keywords) {
        let tempSql = (keywords == 'all' || !keywords) ? `` : `and h.name like concat('%','${keywords}','%')`;
        return `SELECT
        h.*, r.id AS rid,
        r.name AS rname,
        r.nameZh AS rnameZh
    FROM
        (
            (
                hr h
                LEFT JOIN hr_role h_r ON ((h.id = h_r.hrid))
            )
            LEFT JOIN role r ON ((h_r.rid = r.id))
        )
    WHERE
        h.id NOT IN (
            SELECT
                h_r.hrid
            FROM
                hr_role h_r,
                role r
            WHERE
                h_r.rid = r.id
            AND r.nameZh = '系统管理员'
        ) ${tempSql} order by h.id limit 10`;
    },
    /** and h.`name` like concat('%',#{keywords},'%') */
    /**
     * 系统管理员更新hr是否可用
     */
    hrRolesIsEnabled: function (hrInfo) {
        let name = hrInfo.name ? `name=${hrInfo.name},` : ``,
            phone = hrInfo.phone ? `phone=${hrInfo.phone},` : ``,
            telephone = hrInfo.telephone ? `telephone=${hrInfo.telephone},` : ``,
            address = hrInfo.address ? `address=${hrInfo.address},` : ``,
            enabled = hrInfo.enabled ? `enabled=${hrInfo.enabled},` : ``,
            username = hrInfo.username ? `username=${hrInfo.username},` : ``,
            password = hrInfo.password ? `password=${hrInfo.password},` : ``,
            userface = hrInfo.userface ? `userface=${hrInfo.userface},` : ``,
            remark = hrInfo.remark ? `remark=${hrInfo.remark},` : ``;
        let sumSql = `${name}${phone}${telephone}${address}${enabled}${username}${password}${userface}${remark}`;
        let tempSq = sumSql.replace(/,$/, '');
        return `update hr set
        ${tempSq}
        where id = ${hrInfo.id}`;
    },
    addRolesForHr: function (val) {
        return `INSERT INTO hr_role(hrid,rid) VALUES ${val}`;
    },
    deleteRoleByHrId: function (hrid, rid) {
        return `DELETE FROM hr_role where hrid=${hrid} and rid in ${rid}`;
    },
    selectHrRole: function (hid) {
        return `SELECT hr_role.rid FROM hr LEFT JOIN hr_role on hr.id=hr_role.hrid WHERE hr.id=${hid}`;
    },
    /**
     * 权限组管理
     */
    accessAuthorityAdd: function (authGroup) {
        return `INSERT INTO role set name='${authGroup.role}',nameZh='${authGroup.roleZh}'`;
    },
    accessAuthorityDelete: function (rid) {
        return `DELETE FROM role WHERE id=${rid}`;
    },
    /**
     * 职位管理
     */
    positionManaAdd: function (pos) {
        return `INSERT INTO position set name='${pos.name}'`;
    },
    positionManaUpdate: function (pos) {
        return `UPDATE position set name='${pos.name}' WHERE id=${pos.id}`;
    },
    positionManaDelete: function (ids) {
        return `DELETE FROM position WHERE id IN ${ids}`;
    },
    /**
     * 职位等级的管理 jobLevel
     */
    jobLevelManaAdd: function (jobLevel) {
        return `INSERT INTO joblevel SET name='${jobLevel.name}',titleLevel='${jobLevel.titleLevel}'`;
    },
    jobLevelManaUpdate: function (jobLevel) {
        return ` UPDATE joblevel set  name='${jobLevel.name}',titleLevel='${jobLevel.titleLevel}' WHERE id=${jobLevel.id}`;
    },
    jobLevelManaDelete: function (id) {
        return `DELETE FROM joblevel WHERE id IN ${id}`;
    },
    /**
     * refreshHr更新管理员的权限
     */
    refreshHr: function (hrid) {
        return `SELECT
        h.*, r.id AS rid,
        r.name AS rname,
        r.nameZh AS rnameZh
    FROM
        (
            (
                hr h
                LEFT JOIN hr_role h_r ON ((h.id = h_r.hrid))
            )
            LEFT JOIN role r ON ((h_r.rid = r.id))
        )
    WHERE
        h.id NOT IN (
            SELECT
                h_r.hrid
            FROM
                hr_role h_r,
                role r
            WHERE
                h_r.rid = r.id
            AND r.nameZh = '系统管理员'
        )
    AND h_r.hrid=${hrid}`;
    },
    /**
     * 删除hr管理员的相关的信息
     */
    deleteHr: function (hrId) {
        return ` DELETE FROM hr WHERE id=${hrId}`;
    },
    /**
     * 创建新的Hr信息
     */
    addNewHr: function (hrInfo) {
        return `INSERT INTO hr
        SET name='${hrInfo.name}' ,phone='${hrInfo.phone}',
         telephone ='${hrInfo.telephone}',username ='${hrInfo.username}',
         address ='${hrInfo.address}',enabled ='${hrInfo.enabled}',
         password ='${hrInfo.password}',  remark='${hrInfo.remark}'`;
    },
    /**
     * 最后插入的Hrid
     */
    lastHrInsertId: function () {
        return `select max(id) as rid from hr`;
    },
    /**
     * 判断用户是否存在
     */
    isExistHrUserName: function (username) {
        return `SELECT id from hr WHERE hr.username='${username}'`;
    },
    /**
     * 更新用户中心
     */
    fetchPass: function (id) {
        return `SELECT password FROM hr WHERE id=${id}`;
    },
    updateHrUserInfo: function (hrInfo) {
        let name = hrInfo.name ? `name='${hrInfo.name}',` : ``,
            phone = hrInfo.phone ? `phone='${hrInfo.phone}',` : ``,
            telephone = hrInfo.telephone ? `telephone='${hrInfo.telephone}',` : ``,
            address = hrInfo.address ? `address='${hrInfo.address}',` : ``,
            enabled = hrInfo.enabled ? `enabled=${hrInfo.enabled},` : ``,
            username = hrInfo.username ? `username='${hrInfo.username}',` : ``,
            password = hrInfo.password ? `password='${hrInfo.password}',` : ``,
            userface = hrInfo.userface ? `userface=${hrInfo.userface},` : ``,
            remark = hrInfo.remark ? `remark='${hrInfo.remark}',` : ``;
        let sumSql = `${name}${phone}${telephone}${address}${enabled}${username}${password}${userface}${remark}`;
        let tempSq = sumSql.replace(/,$/, '');
        return `update hr set
        ${tempSq}
        where id = ${hrInfo.id}`;
    },
    updateHrPortrait: function (hrInfo) {
        return `update hr SET userface='${hrInfo.userface}' where username='${hrInfo.username}' and password='${hrInfo.password}'`;
    },
    getSysMessage: function (hrid, start, size) {
        return `SELECT
        sm.*, mc.message,
        mc.title,
        mc.createDate,
        mc.id AS mcid
    FROM
        sysmsg sm,
        msgcontent mc
    WHERE
        sm.mid = mc.id
    AND sm.hrid = ${hrid} 
    order by mc.createDate desc 
    limit ${start},${size}`;
    },
    markRead: function (hrid, flag) {
        let sqlFrag = flag == -1 ? `UPDATE sysmsg set state=1 WHERE hrid=${hrid}` : `UPDATE sysmsg set state=1 WHERE hrid=${hrid} AND mid=${flag}`;
        return sqlFrag;
    },
    /**
     * 获取用户
     */
    getAllHrUsers: function () {
        return `SELECT
        address,
        enabled,
        id,
        name,
        phone,
        remark,
        telephone,
        userface,
        username
    FROM
        hr`;
    },
    /**
     * 获取集团的信息
     */
    getConglomerateInfo: function () {
        return `SELECT * from conglomerate`;
    },
};
module.exports = sqlSentence;