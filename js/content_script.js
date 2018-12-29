chrome.storage.local.get(['AB_Enabled'], function (r) {
    if (r.AB_Enabled == 1) {
        autoBuy();
    }
})

function autoBuy() {
    chrome.storage.local.get(['AB_Start'], function (r) {

        if (r.AB_Start != 1) {
            layer.msg('Author : li_jr@hotmail.com', {
                time: 0,
                btn: ['开始秒杀', '关闭'],
                btn1: function (index, layero) {
                    chrome.storage.local.set({ AB_Start: 1 }, function () {
                        window.location.reload();
                    });
                },
                btn2: function (index, layero) {
                    chrome.storage.local.set({ AB_Start: 0 }, function () {
                    });
                }
            });
            $('.layui-layer-dialog').css('z-index', '10000000000000');
        }
        else {
            $(function () {
                var startTime = 0,
                    url = window.location.href;
                var intervalId = setInterval(function () {
                    startTime += 50;
                    if (startTime > 500)
                        window.location.reload();

                    var btn, result = '';
                    if (document.title.indexOf('security') != -1 || document.title.indexOf('受限') != -1) {
                        result = '受限了，休息一会';
                    }
                    else if (url.indexOf('buy.tmall.com') != -1 || url.indexOf('buy.tmall.hk') != -1 || url.indexOf('buy.taobao.com') != -1 || url.indexOf('buy.m.tmall.com') != -1 || url.indexOf('h5.m.taobao.com/cart/order.html') != -1) {
                        //提交订单页面
                        btn = $('.go-btn');  //查找pc端提交订单button
                        if (btn.length <= 0)
                            btn = $('#submitOrder_1 span[title="提交订单"]'); //查找手机端提交订单button
                        if (btn.length <= 0 && ($('#err').length > 0 || $('.warnning-text').length > 0))
                            result = '下单过于频繁，休息一会吧';
                    }
                    else if (url.indexOf('.alipay.com') != -1) {
                        //支付页面
                        result = '下单成功';
                    }
                    else if (url.indexOf('.ju.taobao.com') != -1) {
                        //聚划算
                        result = '不支持聚划算';
                    }
                    else if (url.indexOf('buyertrade.taobao.com/trade/itemlist/') != -1 || url.indexOf('login.taobao.com') != -1) {
                        //登录页面
                        result = '未登录';
                    }
                    else {
                        //购买页面
                        btn = $('.J_LinkBuy');  //查找pc端淘宝购买button
                        if (btn.length <= 0)
                            btn = $('#J_LinkBuy'); //查找pc端天猫购买button
                        if (btn.length <= 0)
                            btn = $('.buy .btn-title'); //查找手机端淘宝购买button
                        if (btn.length <= 0)
                            btn = $('.trade .buy '); //查找手机端天猫购买button
                    }
                    if (result || btn.length > 0) {
                        clearInterval(intervalId);
                        if (result) {
                            chrome.storage.local.set({ AB_Start: 0 }, function () {
                            });
                            layer.msg(result, {
                                time: 1000
                            });
                            $('.layui-layer-dialog').css('z-index', '10000000000000');
                            return;
                        }
                        btn.click();
                    }
                }, 50);
            });
        }
    });
}