/*日期格式化*/
function getFormatDate(date) {
    var year = date.getFullYear().toString(),
        month = (date.getMonth() + 1).toString(),
        dat = date.getDate().toString();
    return year + '-' + addZero(month) + '-' + addZero(dat);
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

const time = new Date();
const today = getFormatDate(time);
time.setTime(time.getTime() - 1 * 24 * 60 * 60 * 1000);
const yesterday = getFormatDate(time);
time.setTime(time.getTime() - 6 * 24 * 60 * 60 * 1000);
const recent = getFormatDate(time);
time.setTime(time.getTime() - 23 * 24 * 60 * 60 * 1000);
const recentThirtyDays = getFormatDate(time);
sqlSentence = {
    /*数据分析*/
    /*获取今日已支付的订单数量*/
    queryTodayOrderPaidNum: function () {
        /*今日支付订单数*/
        return "SELECT" +
            " count(bo.id) TodayOrderPaidNum" +
            " FROM" +
            " business_order bo" +
            " LEFT JOIN pay_record pr ON bo.order_id = pr.order_id" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + today + "'" +
            " AND bo.`status` != 6" +
            " AND pr.`status` = 1";
    },
    /*昨日GMV(待付款+已支付)*/
    readyToPayAndPaidSum: function () {
        return "select sum(pr.amount) readyToPayAndPaidSum from business_order bo" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + yesterday + "'";
    },
    /*昨日支付金额*/
    yesterdayPaidSum: function () {
        return "select sum(pr.amount) yesterdayPaidSum from business_order bo" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1" +
            " and bo.status != '6'" +
            " and DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + yesterday + "'";
    },
    /*昨日退款金额*/
    yesterdayRefundSum: function () {
        return "select sum(pr.amount) yesterdayRefundSum from pay_record pr where pr.`status` = '3'" +
            " and DATE_FORMAT(pr.pay_date, '%Y-%m-%d')  = '" + yesterday + "'";
    },
    /*昨日新用户创收*/
    newUsersGenerantedGevenueYesterday: function () {
        return "SELECT" +
            " sum(pr.amount) GenerantedGevenue" +
            " FROM" +
            " business_order bo" +
            " LEFT JOIN sys_user su ON bo.sys_user_id = su.id" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + yesterday + "'" +
            " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + recentThirtyDays + "'" +
            " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + today + "'" +
            " AND pr.`status` = 1";
    },
    /*最近7天下单金额*/
    recentSevenDaysOrderPaidSum: function () {
        return "select sum(pr.amount) SevenDaysOrderPaidSum from business_order bo" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1 " +
            " and bo.status != '6'" +
            " and DATE_FORMAT(bo.create_date, '%Y-%m-%d') < '" + today + "'" +
            " and DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + recent + "'";
    },
    /*今日新增用户数*/
    todayAddUserSum: function () {
        return "SELECT" +
            " count(su.id) addUserSum" +
            " FROM" +
            " sys_user su" +
            " WHERE" +
            " DATE_FORMAT(su.create_date, '%Y-%m-%d') = '" + today + "'" +
            " AND su.weixin_attention_status = '1'" +
            " AND su.user_type like 'business%'";
    },
    /*今日下单用户数*/
    todayOrderSum: function () {
        return "SELECT" +
            " count(DISTINCT(bo.sys_user_id)) todayorderSum" +
            " FROM" +
            " business_order bo" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + today + "'";
    },
    /*昨日下单用户数*/
    yesterdayOrderSum: function () {
        return "SELECT" +
            " count(DISTINCT(bo.sys_user_id)) yesterdayorderSum" +
            " FROM" +
            " business_order bo" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') = '" + yesterday + "'";
    },
    /*昨日净增用户数*/
    addUserNum: function () {
        return "SELECT" +
            " count(su.id) sum" +
            " FROM" +
            " sys_user su" +
            " WHERE" +
            " su.weixin_attention_status = '1'" +
            " and DATE_FORMAT(su.create_date, '%Y-%m-%d') = '" + yesterday + "'";
    },
    /*z昨日取关*/
    deleteUser: function () {
        return "SELECT" +
            " count(su.id) sum" +
            " FROM" +
            " sys_user su" +
            " WHERE" +
            " su.weixin_attention_status = '0'" +
            " and DATE_FORMAT(su.create_date, '%Y-%m-%d') = '" + yesterday + "'";
    },

    /*最近7天客户数*/
    recentAverageCost: function () {
        return "SELECT" +
            " count(DISTINCT(bo.sys_user_id)) recentUserSum" +
            " FROM" +
            " business_order bo" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') < '" + today + "'" +
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + recent + "'";
    },
    /*获取指定日期内的订单数*/
    getRecentOrderSum: function (date) {
        return "select count(bo.id) daysOrderNum from business_order bo" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1 "+
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'"
    },
    /*获取指定日期的商品的个数*/
    getRecentGoodsSum: function (date) {
        return "SELECT" +
            " sum(opr.product_num) GoodsSum" +
            " FROM" +
            " business_order bo" +
            " LEFT JOIN order_product_relation opr ON opr.business_order_id = bo.order_id" +
            " WHERE" +
            " DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'";
    },
    /*近期新用户的订单个数*/
    recentNewUserOrderSum(date) {
        return "SELECT" +
            " count(bo.id) newUserOrderSum" +
            " FROM" +
            " business_order bo" +
            " LEFT JOIN sys_user su ON bo.sys_user_id = su.id" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1 " +
            " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + recentThirtyDays + "'" +
            " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + today + "'" +
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'";
    },
    /*近期老用户的订单个数*/
    recentOldUserOrderSum(date) {
        return "SELECT" +
            " count(bo.id) oldUserOrderSum" +
            " FROM" +
            " business_order bo" +
            " LEFT JOIN sys_user su ON bo.sys_user_id = su.id" +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1 " +
            " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') < '" + recentThirtyDays + "'" +
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'";
    },
    /*近期交易量，已支付，待支付，已退款*/
    recentAlreadyPay: function (date) {
        return "select sum(pr.amount) sum from business_order bo " +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 1 " +
            " and bo.status != '6'" +
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'";
    },
    recentNotyetPay: function (date) {
        return "select sum(pr.amount) sum from business_order bo " +
            " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
            " where pr.`status` = 0 " +
            " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') ='" + date + "'";

    },
    recentRefund: function (date) {
        return "select sum(pr.amount) sum from pay_record pr where pr.`status` = '3'" +
            " and DATE_FORMAT(pr.pay_date, '%Y-%m-%d') ='" + date + "'";
    },
    /*新增用户，取关用户，净增用户*/
    newUsersAddSum: function (date) {
        return "SELECT" +
            " count(su.id) sum" +
            " FROM" +
            " sys_user su" +
            " WHERE" +
            " su.weixin_attention_status = '1'" +
            " AND su.user_type like 'business%'" +
            " and DATE_FORMAT(su.create_date, '%Y-%m-%d') = '" + date + "'";
    },
    usersLeave: function (date) {
        return "SELECT" +
            " count(su.id) sum" +
            " FROM" +
            " sys_user su" +
            " WHERE" +
            " su.weixin_attention_status = '0'" +
            " AND su.user_type like 'business%'" +
            " and DATE_FORMAT(su.create_date, '%Y-%m-%d') = '" + date + "'";
    },
    /*导表数据*/
    /*
    *
    * 1总订单数 :orderSum
	2用户活跃数 :userActive
	3GMV(待付款和已支付) :GMV
	4支付总金额 :paidTotalAmount
	5客单价 :costPer
	6新增用户数 :userAdded
	7新用户扫码关注 :scanQRAdded
	8新用户搜索关注 :searchAdded
	9新用户购买订单数 ：buyOrders
	10新用户创收 ：newUsersC*/

    exportExcelData: function (st, et) {
        return {
            /*1单天总订单数*/
            orderSumPerday: function (st, et) {
                return "SELECT" +
                    " count(bo.id) orderSum,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate" +
                    " FROM" +
                    " business_order bo" +
                    " WHERE" +
                    " DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC";
            },
            /*2用户活跃数*/
            usersActive: function (st, et) {
                return "select count(DISTINCT(bo.sys_user_id))  userActive,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate from business_order bo " +
                    " WHERE DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC";
            },
            /*3GMV(待付款和已支付)*/
            readyToPayAndPaidSum: function (st, et) {
                return "select sum(pr.amount) GMV ,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate from business_order bo" +
                    " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
                    " WHERE" +
                    " DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC";
            },
            /*4支付总金额*/
            PaidSum: function (st, et) {
                return "select sum(pr.amount) paidTotalAmount,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate from business_order bo" +
                    " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
                    " where pr.`status` = 1" +
                    " and bo.status != '6'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC";
            },
            /*5支付总金额/活跃用户数目=客单价  costPer*/
            /*6新增用户数*/
            addUserSum: function (st, et) {
                return "SELECT" +
                    " count(su.id) userAdded, DATE_FORMAT(su.create_date, '%Y-%m-%d') sudate" +
                    " FROM" +
                    " sys_user su" +
                    " WHERE" +
                    " su.weixin_attention_status = '1'" +
                    " AND su.user_type like 'business%'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(su.create_date, '%Y-%m-%d')" +
                    " ORDER BY su.create_date ASC";
            },

            /*7新用户扫码关注 scanQRAdded*/
            scanUserAdded: function (st, et) {
                return "SELECT" +
                    " count(su.id) scanQRAdded,DATE_FORMAT(su.create_date, '%Y-%m-%d') sudate" +
                    " FROM" +
                    " sys_user su" +
                    " WHERE" +
                    " su.weixin_attention_status = '1'" +
                    " AND su.user_type like 'business%'" +
                    " AND su.parent_user_id is not null" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(su.create_date, '%Y-%m-%d')" +
                    " ORDER BY su.create_date ASC";
            },
            /*8新用户搜索关注 :searchAdded */
            searchUserAdded: function (st, et) {
                return "SELECT" +
                    " count(su.id) searchAdded,DATE_FORMAT(su.create_date, '%Y-%m-%d') sudate" +
                    " FROM" +
                    " sys_user su" +
                    " WHERE" +
                    " su.weixin_attention_status = '1'" +
                    " AND su.user_type like 'business%'" +
                    " AND su.parent_user_id is null" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(su.create_date, '%Y-%m-%d')" +
                    " ORDER BY su.create_date ASC";
            },
            /*9新用户购买订单数 ：buyOrders*/
            userOrderSum: function (st, et) {
                return "SELECT" +
                    " count(bo.id) newUserOrderSum,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate" +
                    " FROM" +
                    " business_order bo" +
                    " LEFT JOIN sys_user su ON bo.sys_user_id = su.id" +
                    " WHERE" +
                    " DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + recentThirtyDays + "'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + today + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC";
            },
            /*10新用户创收 ：newUsersC*/
            newUsersGenerantedGevenue: function (st, et) {
                return "SELECT" +
                    " sum(pr.amount) GenerantedGevenue,DATE_FORMAT(bo.create_date, '%Y-%m-%d') bodate" +
                    " FROM" +
                    " business_order bo" +
                    " LEFT JOIN sys_user su ON bo.sys_user_id = su.id" +
                    " LEFT JOIN pay_record pr on bo.order_id = pr.order_id" +
                    " WHERE" +
                    " DATE_FORMAT(su.create_date, '%Y-%m-%d') >= '" + recentThirtyDays + "'" +
                    " AND DATE_FORMAT(su.create_date, '%Y-%m-%d') <= '" + today + "'" +
                    " AND pr.`status` = 1" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') >= '" + st + "'" +
                    " AND DATE_FORMAT(bo.create_date, '%Y-%m-%d') <= '" + et + "'" +
                    " GROUP BY DATE_FORMAT(bo.create_date, '%Y-%m-%d')" +
                    " ORDER BY bo.create_date ASC ";
            },
        }
    },


}
module.exports = sqlSentence;