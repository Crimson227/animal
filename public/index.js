var logoBtn = document.getElementById("logo-btn");
var table = document.getElementsByTagName("table")[0];
var closeModalBtns = document.querySelectorAll(".close-modal-btn");
var modalBackdrop = document.getElementById("modal-backdrop");
var cancelDeleteBtn = document.getElementById("cancel-delete");
var deleteModalBackdrop = document.getElementById("delete-modal-backdrop");
var deleteModal = document.getElementById("delete-modal");
var confirmDeleteBtn = document.getElementById("confirm-delete");
var confirmBtn = document.getElementById("confirm-btn");
var addNewBtn = document.getElementById("add-btn");
var updateBtn = document.getElementById("update-btn");
var deleteBtn = document.getElementById("delete-btn");

// 首页跳转逻辑
if (logoBtn) {
    logoBtn.addEventListener('click', function () {
        window.location.href = '/';
    });
}

// ==========================================
// 修复核心：使用事件委托处理侧边栏点击
// ==========================================
var navLinksContainer = document.getElementById("nav-links");
if (navLinksContainer) {
    navLinksContainer.addEventListener('click', function (event) {
        // 向上寻找最近的 button 元素
        var btn = event.target.closest('button');

        // 如果点到的不是按钮，或者点击的是 logo 按钮（已单独处理），则忽略
        if (!btn || btn.id === 'logo-btn') return;

        // 获取按钮 ID 的前缀 (例如 animals-nav-btn -> animals)
        var btnName = btn.id.split("-")[0];

        // 跳转到对应页面
        window.location.href = "./" + btnName;
    });
}

/* 高亮当前页面的导航按钮，并更新顶部面包屑文字 */
function highlightNavbarButton(bID) {
    var navBtn = document.getElementById(bID);
    if (navBtn) {
        // 1. 添加激活样式
        navBtn.classList.add("active");

        // 2. 动态更新顶部面包屑文字
        var pageTitle = navBtn.querySelector('span') ? navBtn.querySelector('span').innerText : "未知页面";
        var breadcrumb = document.querySelector('.breadcrumb');

        if (breadcrumb) {
            breadcrumb.innerHTML = '<i class="fa-solid fa-location-dot"></i> 当前位置：' + pageTitle;
        }
    }
}

// 首页特殊处理：如果在根路径，手动高亮首页按钮
if (window.location.pathname === '/') {
    if (logoBtn) logoBtn.classList.add("active");
    var breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = '<i class="fa-solid fa-location-dot"></i> 当前位置：系统首页';
    }
}

/* 发送 POST 请求并刷新页面 */
async function postData(url, data, reload) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((response) => {
        if (response.ok && reload) {
            window.location.href = reload;
        } else if (!response.ok) {
            alert("操作失败，请检查输入数据！");
        }
    }).catch(err => {
        console.error(err);
        alert("网络请求出错");
    });
}

/* 获取并替换表格行 */
function fetchAndReplaceTableRows(getRequest, table, hbTemplate) {
    if (!table) return;

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    fetch(getRequest)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                var newRow = hbTemplate(data[i])
                table.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 模态框关闭逻辑
if (closeModalBtns) {
    for (let i = 0; i < closeModalBtns.length; i++) {
        closeModalBtns[i].addEventListener('click', function (event) {
            var modal = event.target.closest('.modal-skeleton');
            if (modal) modal.classList.add('hidden');

            if (modalBackdrop) modalBackdrop.classList.add('hidden');
            if (deleteModalBackdrop) deleteModalBackdrop.classList.add('hidden');
        })
    }
}

// 删除确认框逻辑
if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', function () {
        if (deleteModal) deleteModal.classList.add('hidden');
        if (deleteModalBackdrop) deleteModalBackdrop.classList.add('hidden');
    })
}

// 格式化日期函数
function formatDate(date) {
    if (!date) return "";

    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;

    var d = new Date(date);
    if (isNaN(d.getTime())) return date;

    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}