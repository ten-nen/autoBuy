
chrome.storage.local.get(['AB_Enabled'], function (r) {
    if (r.AB_Enabled == 1) {
        $('#btn').text('禁用');
    } else {
        $('#btn').text('启用');
        chrome.storage.local.set({ AB_Enabled: 0 }, function () {
        });
        chrome.storage.local.set({ AB_Start: 0 }, function () {
        });
    }
})

$('#btn').on('click', function () {
    if ($(this).text() == '启用') {
        $(this).text('禁用');
        chrome.storage.local.set({ AB_Enabled: 1 }, function () {
            chrome.tabs.executeScript(null, {
                file: 'js/content_script.js'
            }, function () {
                setTimeout(function () {
                    window.close();
                }, 100)
            })
        });
    } else {
        $(this).text('启用');
        chrome.storage.local.set({ AB_Enabled: 0 }, function () {
        });
        chrome.storage.local.set({ AB_Start: 0 }, function () {
        });
    }
})