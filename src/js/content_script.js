chrome.storage.local.get(['AB_Enabled'], function (r) {
    if (r.AB_Enabled == 1) {
        startBuy();
    }
})

function showSelect() {
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

var intervalId;

function startBuy() {
    chrome.storage.local.get(['AB_Start'], function (r) {
        console.log('auto_bug');
        if (r.AB_Start != 1) {
            showSelect();
        }
        else {
            $(function () {
                autoBuy();
            });
        }
    });
}

function showMsg(msg) {
    layer.msg(msg, {
        time: 1000
    });
    $('.layui-layer-dialog').css('z-index', '10000000000000');
}

function stopBuy() {
    chrome.storage.local.set({ AB_Start: 0 }, function () {
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function btnClick(getBtn, time, checkDisabled) {
    time = time || 0;

    if (checkDisabled) {
        var disableBtn = $('.buy.btn-disabled ')[0] || $('.buy.disabled')[0]; //下架按钮
        if (disableBtn) {
            showMsg('下架中，即将刷新页面..');
            window.location.reload();
            return;
        }
    }

    if (time > 500) {
        showMsg('等待页面加载按钮超时，即将刷新页面..');
        window.location.reload();
        return;
    }

    var btn = getBtn();
    if (btn) {
        btn.click();
        setInterval(function () {
            btn.click();
        }, 100);
        return;
    }
    sleep(100).then(() => {
        time += 100;
        btnClick(getBtn, time, checkDisabled);
    });
}

function autoBuy() {
    var url = window.location.href;
    if (document.title.indexOf('security') != -1 || document.title.indexOf('受限') != -1) {
        stopBuy();
        showMsg('受限了，休息一会');
        return;
    }
    if (url.indexOf('buy.tmall.com') != -1 || url.indexOf('buy.tmall.hk') != -1 || url.indexOf('buy.taobao.com') != -1 || url.indexOf('buy.m.tmall.com') != -1 || url.indexOf('h5.m.taobao.com/cart/order.html') != -1) {
        //提交订单页面
        showMsg('提交订单中..');
        btnClick(function () {
            var btn = $('.go-btn')[0] || $('#submitOrder_1 span[title="提交订单"]')[0];  //pc端提交订单button || 手机端提交订单button
            return btn;
        }, 0, false);
    }
    else if (url.indexOf('.alipay.com') != -1) {
        //支付页面
        stopBuy();
        showMsg('下单成功..');
    }
    else if (url.indexOf('.ju.taobao.com') != -1) {
        //聚划算
        stopBuy();
        showMsg('不支持聚划算..');
    }
    else if (url.indexOf('buyertrade.taobao.com/trade/itemlist/') != -1 || url.indexOf('login.taobao.com') != -1) {
        //登录页面
        stopBuy();
        showMsg('未登录..');
    }
    else {
        //购买页面
        showMsg('自动购买中..');
        btnClick(function () {
            var btn = btn = $('.J_LinkBuy')[0] || $('#J_LinkBuy')[0] || $('.buy .btn-title')[0] || $('.trade .buy ')[0];  //pc端淘宝购买button || pc端天猫购买button || 手机端淘宝购买button || 手机端天猫购买button
            return btn;
        }, 0, true);

    }
}