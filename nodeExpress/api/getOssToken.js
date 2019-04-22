// const crypto = require("crypto")
const config = {
    dirPath: 'images/', // 存放到哪个目录下
    bucket: 'zhangzhenchuan',
    region: 'oss-ap-northeast-1',// 我的是 hangzhou
    accessKeyId: 'LTAIVnNG2cTRCJyz',
    accessKeySecret: 'droqBD9xxlro8gYlkVlW8lamThIsrA',
    expAfter: 300000, // 签名失效时间，毫秒
    maxSize: 1048576000 // 文件最大的 size
}
app.get('/getOssToken', (req, res) = > {
    const host = `https://${config.bucket}.${config.region}.aliyuncs.com`
    const expireTime = new Date().getTime() + config.expAfter
    const expiration = new Date(expireTime).toISOString()
    const policyString = JSON.stringify({
        expiration,
        conditions: [
            ['content-length-range', 0, config.maxSize],
            ['starts-with', '$key', config.dirPath]
        ]
    })
    const policy = Buffer.from(policyString).toString('base64')
    res.json({
    accessKeySecret: accessKeySecret,
    policy,
    host,
    'OSSAccessKeyId': config.accessKeyId,
    'key': expireTime,
    'success_action_status': 201,
    'dirPath': config.dirPath,
})
})
module.exports = router;