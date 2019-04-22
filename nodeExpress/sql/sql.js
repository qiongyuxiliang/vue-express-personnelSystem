sqlSentence = {

    /*用户登录*/
    loginByMobile: function (mobile, pass) {
        return "SELECT s.* FROM sys_user s WHERE s.mobile='" + mobile + "' AND s.password='" + pass + "'"
    },
    /*根据id查询商品的各个字段，作为返回值*/
    queryAllProducts: function (productId) {
        // p.type = 'offline'
        return "select p.id,p.name,p.product_id,p.brand,p.type,p.description,p.first_url,p.price,p.status,p.create_date,p.second_type,product_prefecture,p.product_amount,p.teacher_name,p.product_class_id,p.parent_product_id,p.astrict from business_product p WHERE p.type = 'offline' AND p.product_id = '" + productId + "' ORDER BY create_date DESC";
    },
    /*查询商品的并且获取商品的id，从而实现统计商品的销量的作用，根据startNum,pageNum规定返回的数据从哪返回以及返回多少条数据，其他的属性则为查询条件*/
    getProductId(startNum, pageNum, status = '', productId = '', productName = '') {
        var startNumBool = startNum !== '' ? true : false,
            statusBool = status !== '' ? true : false;
        /*!startNumBool和！pageNum表示的是获取查询数据库的长度lenth*/
        if (startNumBool && pageNum && statusBool && !productId && !productName) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (startNumBool && pageNum && !statusBool && !productId && !productName) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (statusBool && !productId && !productName) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' ORDER BY create_date DESC";
        } else if (startNumBool && pageNum && !statusBool && !productId && !productName) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (!startNumBool && !pageNum && !statusBool && !productId && !productName) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' ORDER BY create_date DESC";
        } else if (!statusBool && startNumBool && pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (statusBool && startNumBool && pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (statusBool && !startNumBool && !pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC";
        } else if (!statusBool && startNumBool && pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (statusBool && startNumBool && pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC limit " + startNum + "," + pageNum;
        } else if (statusBool && !startNumBool && !pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.status ='" + status + "' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC";
        } else if (!statusBool && !startNumBool && !pageNum && (productId || productName)) {
            return "select p.product_id from business_product p WHERE p.`type` = 'offline' AND p.product_id LIKE '%" + productId + "%' AND p.name LIKE '%" + productName + "%'  ORDER BY create_date DESC";
        }
    },
    /*按id查询每个商品，并统计该商品的销量*/
    getSellNumByProductId: function (productId) {

        return "SELECT IFNULL(SUM(product_num),0) from pay_record p,order_product_relation o WHERE p.`status` = '1' AND o.business_order_id = p.order_id AND o.business_product_id = '" + productId + "'";
    },
    updateProductById: function (productIdPri, productId, productName, brand, price, productAmount, firstUrl, description, type, status) {

        return "UPDATE business_product SET product_id='" + productId + "',name='" + productName + "',brand='" + brand + "',description='" + description + "',first_url='" + firstUrl + "',type='" + type + "',price='" + price + "',status='" + status + "',product_amount='" + productAmount + "'WHERE product_id ='" + productIdPri + "'";
        // return "UPDATE business_product SET product_id='" + productId + "',name='" + productName + "',brand='" + brand + "',description='" + description + "',first_url='" + firstUrl + "',type='" + type + "',price='" + price+ "',status='" + status+ "',second_type='" + secondType+ "',product_class_id='" + productClassId+ "',product_amount='" + productAmount+ "',product_prefecture='"+productPrefecture+"',astrict='"+astrict+"' WHERE product_id =" '"+productIdPri+"';
    },
    delProductById: function (id) {
        /*商品下架*/
        return "UPDATE business_product p SET p.status= 0 WHERE p.id = '" + id + "'";
    },
    putAwayProductById: function (id) {
        /*商品上架*/
        return " UPDATE business_product p SET p.status= 1 WHERE p.id = '" + id + "'";
    },
    findProductById: function (id) {
        return "select p.id,p.name,p.product_id,p.brand,p.type,p.description,p.first_url,p.price,p.status,p.create_date,p.second_type,product_prefecture,p.product_amount,p.teacher_name,p.product_class_id,p.parent_product_id,p.astrict FROM business_product p WHERE p.product_id = '" + id + "'";

    },
    updateProduct: function (id, productId, productName, brand, description, firstUrl, type, price, status, secondType, productClassId, productAmount, productPrefecture, astrict) {
        return "UPDATE business_product SET product_id='" + productId + "',name='" + productName + "',brand='" + brand + "',description='" + description + "',first_url='" + firstUrl + "',type='" + type + "',price='" + price + "',status='" + status + "',second_type='" + secondType + "',product_class_id='" + productClassId + "',product_amount='" + productAmount + "',product_prefecture='" + productPrefecture + "',astrict='" + astrict + "' WHERE product_id = '" + id + "'";
    },
    /*添加新的商品*/
    addNewProduct: function (id, productName, productId, brand, type, description, firstUrl, price, status, createDate, secondType, productClassId, productPrefecture, productAmount, teacherName, parentProductId, astrict) {
        return "INSERT INTO business_product(id,name,product_id,brand,type,description,first_url,price,status,create_date,second_type,product_class_id,product_prefecture,product_amount,teacher_name,parent_product_id,astrict) VALUES ('" + id + "','" + productName + "','" + productId + "','" + brand + "','" + type + "','" + description + "','" + firstUrl + "','" + price + "','" + status + "','" + createDate + "','" + secondType + "','" + productClassId + "','" + productPrefecture + "','" + productAmount + "','" + teacherName + "', '" + parentProductId + "','" + astrict + "')"
    },
    chatUserInfoThen: function (current_user_id) {
        return "SELECT p.create_date,p.micro_business_role,p.mobile,p.micro_random FROM sys_user p WHERE p.id='" + current_user_id + "'";

    },
    upGradeTime: function (mobile, startTime, endTime, pageNo, pageSize) {
        if (startTime == '' && endTime != '') {
            st = "2010-1-1"
            et = endTime
        } else if (startTime != '' && endTime == '') {
            et = "2030-3-3"
            st = startTime

        } else {
            st = startTime;
            et = endTime;
        }
        if (startTime == '' && endTime == '') {
            return "SELECT p.create_date FROM micro_flow_record p WHERE p.promote_level_info !='' AND p.current_user_phone='" + mobile + "' ORDER BY create_date DESC limit " + pageNo + "," + pageSize;
        } else if ((startTime != '' && endTime != '') || (startTime == '' && endTime != '') || (startTime != '' && endTime == '')) {

            return "SELECT p.create_date FROM micro_flow_record p WHERE p.promote_level_info !='' AND p.current_user_phone='" + mobile + "' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY create_date DESC limit " + pageNo + "," + pageSize;
        }
    },
    upGradeTimeFirst: function (mobile, createDateStart, createDateEnd) {
        if (createDateStart == '' && createDateEnd != '') {
            st = "2010-1-1"
            et = createDateEnd
        } else if (createDateStart != '' && createDateEnd == '') {
            st = createDateStart
            et = "2030-3-3"

        } else {
            st = createDateStart;
            et = createDateEnd;
        }
        if (mobile == '') {
            return "SELECT p.create_date,current_user_id FROM micro_flow_record p WHERE p.promote_level_info !='' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY create_date DESC";
        } else {
            return "SELECT p.create_date,current_user_id FROM micro_flow_record p WHERE p.promote_level_info !='' AND p.current_user_phone='" + mobile + "' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY create_date DESC";
        }
    },
    checkUserDetailInfoById: function (id, id1) {
        // if(id1){
        //     return "SELECT next_user_id FROM micro_flow_record p WHERE  p.current_user_id='"+id1+"' AND p.promote_level_info IS NULL AND p.next_user_id IS NOT NULL LIMIT 0,1";
        // }else{
        //     return "SELECT p.promote_level_info,p.current_name,p.current_user_phone,p.current_user_type,p.create_date FROM micro_flow_record p WHERE p.promote_level_info IS NOT NULL AND p.current_user_id='"+id+"' ORDER BY create_date DESC";        
        // }
    },

    findUserChildren: function (id) {

        /*获取用户信息的长度*/
        // return "SELECT micro_four_node_relation from "
    },

    checkUserParentInfo: function () {


    },
    instantrebate: function (type, pageNo, pageSize, tel, widrawstatus, timeStart, timeEnd, financeStaffStatus, operationalStaffStatus) {
        if (timeStart == '' && timeEnd != '') {
            st = "2010-1-1";
            et = timeEnd;
        } else if (timeStart != '' && timeEnd == '') {
            st = timeStart;
            et = "2030-3-3"

        } else {
            st = timeStart;
            et = timeEnd;
        }
        // console.log(st,et)
        var examineState;
        if (financeStaffStatus == '' && operationalStaffStatus == '') {
            /*全部状态*/
            examineState = '';
        } else if (financeStaffStatus != '' && operationalStaffStatus != '') {
            if (financeStaffStatus == '2' && operationalStaffStatus == '2') {
                /*未审核*/
                examineState = "AND m.finance_status=2 AND m.operator_status =2"
            } else if (financeStaffStatus == '0' && operationalStaffStatus == '0') {
                /*双方已审核*/
                examineState = "AND m.finance_status!='1' AND m.operator_status!='1'"
            } else if (financeStaffStatus == '1' || operationalStaffStatus == '1') {
                /*审核拒绝*/
                examineState = "AND m.operator_status='1' OR m.finance_status='1'";
            }
        } else if (financeStaffStatus == '0' && operationalStaffStatus == '') {
            /*财务已审核*/
            examineState = "AND m.finance_status!='2'";
        } else if (financeStaffStatus == '' && operationalStaffStatus == '0') {
            /*运维已审核*/
            examineState = "AND m.operator_status!='2'";
        }

        var sqlFrag = "SELECT m.*,b.`status` AS orderStatus FROM micro_review m LEFT JOIN business_order b ON m.order_id=b.order_id  WHERE m.micro_rule_small_type='" + type + "'" + examineState;
        var sqlFragLength = "SELECT count(*) FROM micro_review m LEFT JOIN business_order b ON m.order_id=b.order_id  WHERE m.micro_rule_small_type='" + type + "'" + examineState;
        // var sqlFrag = "SELECT m.*,p.pay_date,b.`status` AS orderstatus,w.`status` AS withdrawstatus FROM micro_flow_record m LEFT JOIN pay_record p on  m.transaction_id=p.order_id LEFT JOIN business_order b ON m.transaction_id=b.order_id LEFT JOIN withdraw_record w ON p.sys_user_id=w.sys_user_id WHERE m.type='" + type + "'";
        // var sqlFragLength = "SELECT count(*) FROM micro_flow_record m LEFT JOIN pay_record p on m.transaction_id=p.order_id LEFT JOIN business_order b ON m.transaction_id=b.order_id LEFT JOIN withdraw_record w ON p.sys_user_id=w.sys_user_id WHERE m.type='" + type + "'";
        if (pageNo === '' && pageSize === '' && tel == '' && widrawstatus == '' && timeStart == '' && timeEnd == '') {
            // 获取长度
            // console.log('s')
            return "SELECT count(*) FROM micro_review WHERE micro_rule_small_type='" + type + "' ORDER BY create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel == '' && widrawstatus == '' && timeStart == '' && timeEnd == '') {
            // 根据type,pageNo,pageSize选取数据
            // console.log('数据')
            return sqlFrag + "ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;

        } else if (pageNo === '' && pageSize === '' && tel != '' && widrawstatus == '' && timeStart == '' && timeEnd == '') {
            // 获取长度
            return sqlFragLength + " AND m.current_user_phone LIKE '%" + tel + "%' ORDER BY m.create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel != '' && widrawstatus == '' && timeStart == '' && timeEnd == '') {
            // 根据type,pageNo,pageSize,tel
            return sqlFrag + " AND m.current_user_phone LIKE '%" + tel + "%' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;

        } else if (pageNo === '' && pageSize === '' && tel != '' && widrawstatus != '' && timeStart == '' && timeEnd == '') {
            // 获取长度
            return sqlFragLength + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' ORDER BY m.create_date DESC";
            //
        } else if (pageNo !== '' && pageSize !== '' && tel != '' && widrawstatus != '' && timeStart == '' && timeEnd == '') {
            // 根据type,pageNo,pageSize,tel,widrawstatus,
            return sqlFrag + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;

        } else if (pageNo === '' && pageSize === '' && tel == '' && widrawstatus != '' && timeStart == '' && timeEnd == '') {
            // 获取长度
            return sqlFragLength + " AND m.amount_type='" + widrawstatus + "' ORDER BY m.create_date DESC";
            // 
        } else if (pageNo !== '' && pageSize !== '' && tel == '' && widrawstatus != '' && timeStart == '' && timeEnd == '') {

            return sqlFrag + " AND m.amount_type='" + widrawstatus + "' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;
            // 根据type,pageNo,pageSize,widrawstatus查询
        } else if (pageNo === '' && pageSize === '' && tel != '' && widrawstatus == '' && (timeStart != '' || timeEnd != '')) {


            return sqlFragLength + " AND m.current_user_phone LIKE '%" + tel + "%' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel != '' && widrawstatus == '' && (timeStart != '' || timeEnd != '')) {

            return sqlFrag + " AND m.current_user_phone LIKE '%" + tel + "%' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;
            // 根据tel,time查询
        } else if (pageNo === '' && pageSize === '' && tel == '' && widrawstatus != '' && (timeStart != '' || timeEnd != '')) {

            return sqlFragLength + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' pageNo == '' && pageSize == '' && tel == '' && widrawstatus != '' && (timeStart != '' || timeEnd != '') ORDER BY m.create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel == '' && widrawstatus != '' && (timeStart != '' || timeEnd != '')) {

            return sqlFrag + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "'ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;
            // 根据widrawstatus,time查询
        } else if (pageNo === '' && pageSize === '' && tel == '' && widrawstatus == '' && (timeStart != '' || timeEnd != '')) {

            return sqlFragLength + " AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel == '' && widrawstatus == '' && (timeStart != '' || timeEnd != '')) {
            // 根据time查询

            return sqlFrag + " AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;

        } else if (pageNo === '' && pageSize === '' && tel != '' && widrawstatus != '' && (timeStart != '' || timeEnd != '')) {
            // 获取长度
            return sqlFragLength + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC";

        } else if (pageNo !== '' && pageSize !== '' && tel != '' && widrawstatus != '' && (timeStart != '' || timeEnd != '')) {
            // 根据type,pageNo,pageSize,tel,widrawstatus,widrawstatus,timeEnd选取数据
            return sqlFrag + " AND m.current_user_phone LIKE '%" + tel + "%' AND m.amount_type='" + widrawstatus + "' AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "' ORDER BY m.create_date DESC limit " + pageNo + "," + pageSize;
        }
        // 根据type,pageNo,pageSize,tel,widrawstatus,widrawstatus,timeEnd选取数据

    },
    /*根据审核id进行查询*/
    auditCommissionSelect: function (incomeRecordId, sysUserType) {
        if (sysUserType == 'manager-1') {
            return "SELECT operator_user_id FROM micro_review WHERE id='" + incomeRecordId + "'";
        } else if (sysUserType == 'finance-1') {
            return "SELECT finance_user_id FROM micro_review WHERE id='" + incomeRecordId + "'";
        }
    },
    auditCommission: function (incomeRecordId, status, sysUserId, sysUserType, operateDate) {
        if (sysUserType == 'manager-1') {
            return "UPDATE micro_review  SET operator_user_id='" + sysUserId + "',operator_oper_date='" + operateDate + "',operator_status='" + status + "' WHERE id='" + incomeRecordId + "'";
        } else if (sysUserType == 'finance-1') {
            return "UPDATE micro_review  SET finance_user_id='" + sysUserId + "',finance_oper_date='" + operateDate + "',finance_status='" + status + "' WHERE id='" + incomeRecordId + "'";
        }
    },
    orderManagement: function (pageNo, pageSize, paySTime, payETime, complishedSTime, complishedETime, orderId, sysUserId, status) {

        var lenFrag;
        var limitSql;
        var payTimeSql;
        var complishTimeSql;
        if (pageNo !== '' && pageSize !== '') {
            limitSql = " ORDER BY p.pay_date DESC limit " + pageNo + "," + pageSize;
            lenFrag = "SELECT b.*, s.nickname, s.mobile, s.identify_number, p.transaction_id, p.pay_date, p. STATUS AS pay_status FROM business_order b, sys_user s, pay_record p WHERE s.id = b.sys_user_id AND b.order_id = p.order_id";

        } else if (pageNo === '' && pageSize === '') {
            limitSql = " ORDER BY b.create_date DESC";
            lenFrag = "SELECT COUNT(1) FROM business_order b, sys_user s, pay_record p WHERE s.id = b.sys_user_id AND b.order_id = p.order_id ";
        }
        /*根据支付时间进行筛选*/
        if (paySTime == '' && payETime == '') {
            payTimeSql='';
        } else if (paySTime == '' && payETime != '') {
            payTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '2010-1-1' AND '" + payETime + "'";
        } else if (paySTime != '' && payETime == '') {
            payTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '"+paySTime+"' AND '2030-3-3'";
        } else {
            payTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '" + paySTime + "' AND '" + payETime + "'";

        }
        /*根据完成时间进行筛选*/
        if (complishedSTime == '' && complishedETime == '') {
            complishTimeSql='';
        } else if (complishedSTime == '' && complishedETime != '') {
            complishTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '2010-1-1' AND '" + complishedETime + "'";
        } else if (complishedSTime != '' && complishedETime == '') {
            complishTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '"+complishedSTime+"' AND '2030-3-3'";

        } else {
            complishTimeSql=" AND DATE_FORMAT(p.pay_date,'%Y-%m-%d') BETWEEN '" + complishedSTime + "' AND '" + complishedETime + "'";
        }
        // AND DATE_FORMAT(m.create_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "'
        /**/
        // orderId,sysUserId,status
        var orderIdSql;
        var sysUserIdSql;
        var statusSql;
        if (orderId == '') {
            orderIdSql = "";
        } else if (orderId != '') {
            orderIdSql = " AND b.order_id LIKE '%" + orderId + "%'";
        }
        if (sysUserId == '') {
            sysUserIdSql = "";
        } else if (sysUserId != '') {
            sysUserIdSql = " AND b.mobile LIKE '%" + sysUserId + "%'";
        }
        if (status == '') {
            statusSql = ""
        } else if (status != '') {
            statusSql = " AND b.status='" + status + "'"
        }
        /*获取查询的长度*/

            return lenFrag + payTimeSql+ complishTimeSql+ orderIdSql + sysUserIdSql + statusSql + limitSql;


    },
    /*查询订单详情*/
    queryOrderBuinessByOrderId: function (orderId) {
        return "SELECT " +
            "ord.order_id," +
            "ord.update_date," +
            "ord.`status`," +
            "ord.type," +
            "usr.mobile," +
            "ord.user_order_address_id," +
            "pay.amount," +
            "MAX(pay.pay_date) AS pay_date," +
            "pay.transaction_id," +
            "oar.user_name_address," +
            "oar.user_phone_address," +
            "oar.user_province_address," +
            "oar.user_city_address," +
            "oar.user_detail_address," +
            "pro.`name`," +
            "pro.price," +
            "pro.product_id," +
            "pro.brand," +
            "opr.product_spec," +
            "opr.product_num " +
            "FROM " +
            "business_order ord " +
            "LEFT JOIN sys_user usr ON ord.sys_user_id = usr.id " +
            "LEFT JOIN order_product_relation opr ON ord.order_id = opr.business_order_id " +
            "LEFT JOIN business_product pro ON opr.business_product_id = pro.product_id " +
            "LEFT JOIN pay_record pay ON ord.order_id = pay.order_id " +
            "LEFT JOIN order_address_relation oar ON oar.business_order_id = ord.order_id " +
            "WHERE ord.order_id='" + orderId + "'";
    },
    queryUserInfoDTOByParameters: function (pageNo, pageSize, userType, mobile, st, et) {

        /*根据设计查询语句*/
        var sqlFrag,
            userTypeSql,
            mobileSql,
            timeSql;

        if (pageNo === '' && pageSize === '') {
            sqlFrag = "SELECT " +
                "COUNT(1) " +
                "FROM sys_user s " +
                "WHERE 1 = 1 ";
        } else if (pageNo !== '' && pageSize !== '') {
            sqlFrag = "SELECT " +
                "s.mobile,s.micro_business_role,s.level_promote_date as update_date,s.micro_random,s.id " +
                "FROM sys_user s " +
                "WHERE " +
                "1=1 ";
        }

        if (userType !== '') {
            userTypeSql = " AND s.micro_business_role='" + userType + "'";
        } else {
            userTypeSql = "";
        }
        if (mobile !== "") {
            mobileSql = " AND s.mobile LIKE '%" + mobile + "%'";
        } else {
            mobileSql = "";
        }
        if (st == '' && et == '') {
            st = "2010-1-1";
            et = "2030-3-3";
        } else if (st == '' && et != '') {
            st = "2010-1-1";
            et = et;
        } else if (st != '' && et == '') {
            st = st;
            et = "2030-3-3"
        } else {
            st = st;
            et = et;
        }
        timeSql = " AND DATE_FORMAT(s.level_promote_date,'%Y-%m-%d') BETWEEN '" + st + "' AND '" + et + "'";
        return sqlFrag + userTypeSql + mobileSql + timeSql;
        // AND user_type = ''
        // AND mobile = ''
        // AND update_date BETWEEN '' AND ''"
    },
    queryAllUsersById: function (id) {
        return {
            queryPersonalInfo: "SELECT m.current_name as name,m.current_mobile as mobile,m.promote_level_info as level,m.create_date as date FROM micro_flow_record m WHERE m.current_user_id='" + id + "' AND m.promote_level_info IS NOT NULL ORDER BY m.create_date DESC",
            queryPersonalPtInfo:"SELECT s.create_date as date,s.micro_business_role as level,s.nickname as name,s.mobile as mobile FROM sys_user s WHERE s.id='"+id+"'",
            queryParentsInfo: "SELECT " +
                "mf.current_name as name," +
                "mf.current_mobile as mobile," +
                "mf.promote_level_info as level," +
                "mf.create_date as date " +
                "FROM " +
                "micro_closure_table m " +
                "LEFT JOIN micro_flow_record mf ON m.parents_user_id = mf.current_user_id " +
                "WHERE " +
                "m.current_user_id = '" + id + "' " +
                "AND mf.promote_level_info IS NOT NULL " +
                "ORDER BY " +
                "mf.create_date DESC LIMIT 0,1",
            queryParentsPTInfo:"SELECT " +
                "s.create_date as date," +
                "s.micro_business_role as level," +
                "s.nickname as name," +
                "s.mobile as mobile "+
                "FROM " +
                "micro_closure_table m " +
                "LEFT JOIN sys_user s ON m.parents_user_id = s.id " +
                "WHERE " +
                "m.current_user_id = '" + id + "' " +
                "AND s.micro_business_role='pt'",
            queryChildrenInfo:"SELECT mf.current_name as name,mf.promote_level_info as level,mf.current_mobile as mobile,mf.create_date as date FROM  micro_closure_table m  LEFT JOIN micro_flow_record mf ON m.current_user_id = mf.current_user_id  WHERE mf.promote_level_info IS NOT NULL AND m.parents_user_id='"+id+"' ORDER BY mf.create_date DESC LIMIT 0,1",
            queryChildrenPtInfo:"SELECT s.create_date as date,s.micro_business_role as level,s.nickname as name,s.mobile as mobile FROM micro_closure_table m LEFT JOIN sys_user s ON m.current_user_id =s.id WHERE m.parents_user_id='"+id+"' AND s.micro_business_role='pt'",
        }

    }
}
module.exports = sqlSentence;