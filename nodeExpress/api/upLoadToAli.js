let OSS = require('ali-oss');

let client = new OSS({
    region: 'oss-ap-northeast-1',
    accessKeyId: 'LTAIVnNG2cTRCJyz',
    accessKeySecret: 'droqBD9xxlro8gYlkVlW8lamThIsrA '
});

async function listBuckets() {
    try {
        const result = await
            client.listBuckets();
        const result2 = await
            client.listBuckets({
                prefix: 'prefix',
            });
    } catch (err) {
        console.log(err);
    }
}

listBuckets();