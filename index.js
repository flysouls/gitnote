const axios = require('axios');
const fs = require('fs');

const cacheData = {
    maxCount: 1,
    pageSize: 10,
    currentPage: 0,
    data: [],
};

axios.defaults.baseURL = 'http://diy.youzanyun.com';
axios.defaults.headers.common['Cookie'] = "sid=YZ662442111379386368YZNoN5IUxs; error=; user_name=%u51E4%u6B4C; app_name=liangpinpuzi; appid=107; clientId=104d655bb419e924dc";

const run = async () => {
    try {
        let { data } = await axios.default.post('/api/open/apps/message/searchBizType', {
            "isValid":null,
            "categoryAlias":null,
            "keyWord":"",
            "bizLineId":null,
            "pageIndex":cacheData.currentPage,
            "pageSize":cacheData.pageSize,
            "clientId":"104d655bb419e924dc"
        })
        console.log('req success curent % max % size %', cacheData.currentPage, cacheData.maxCount, cacheData.pageSize);
        if (data.data) {
            cacheData.maxCount = data.data.total;
            cacheData.currentPage = data.data.pageIndex;
            cacheData.pageSize = data.data.pageSize;
            cacheData.data = cacheData.data.concat(data.data.content.map(item => ({ name: item.categoryName })))
            if (cacheData.maxCount > cacheData.currentPage * cacheData.pageSize) {
                cacheData.currentPage++;
                await run();
            } else {
                console.log(cacheData);
            }

        }
    } catch (err) {
        console.error(err);
    }

    fs.writeFileSync('./xx.json', JSON.stringify(cacheData.data, null, 4), {
        encoding: 'utf-8',
    })
} 

run();