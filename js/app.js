var app = {};

app.menus = {};// 菜单
app.tabs = {};// 标签页


// =========================================
// tabs 标签页
// =========================================

app.tabs.$titleZone = null;// 标签页标题区域
app.tabs.$contentZone = null;// 标签页内容区域
app.tabs.$scrollZone = null;// 标签页标题区域(滚动区)
app.tabs.$titlesZone = null;// 标签页标题区域(标题区)

/**
 * 初始化标签页
 * @param titlesId 标题区域的jq选择器
 * @param contentsId 内容区域的jq选择器
 */
app.tabs.init = function (titlesId, contentsId) {
    app.tabs.$titleZone = $(titlesId);
    app.tabs.$contentZone = $(contentsId);

    app.tabs.$titleZone.empty();
    app.tabs.$titleZone.append(
        '<a class="tabs_title_left pull-left" href="javascript:app.tabs.scrollTo(-200)"><i class="fa fa-chevron-left"></i></a>' +
        '<div class="tabs_title_slimScroll"></div>' +
        '<a class="tabs_title_right pull-right" href="javascript:app.tabs.scrollTo(200)"><i class="fa fa-chevron-right"></i></a>');

    app.tabs.$scrollZone = app.tabs.$titleZone.find("div");
    app.tabs.$scrollZone.append('<ul class="nav nav-tabs tabs_title_menu"></ul>');

    app.tabs.$titlesZone = app.tabs.$scrollZone.find("ul");

    // 绑定滚轮事件
    app.tabs.$scrollZone.on("mousewheel DOMMouseScroll", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
        if (delta > 0) {
            // 向上滚
            app.tabs.scrollTo(-20);
        } else if (delta < 0) {
            // 向下滚
            app.tabs.scrollTo(20);
        }
    });
};

/**
 * 打开新页面
 * @param id 页面id
 * @param title 标题
 * @param url 地址
 * @param menuObj 代表菜单的对象
 * @param hasCloseButton 是否显示关闭按钮
 */
app.tabs.open = function (id, title, url, menuObj, hasCloseButton) {
    // 无id直接跳过
    if (!id)
        return false;

    // 如果指定id的标签页存在的话就直接打开
    if (app.tabs.select(id))
        return;

    // 不考虑低分辨率了
    // 如果是低分辨率，则在当先已显示的iframe打开新的页面
    // if (app.isLowResolution) {
    //     // 获取已显示的iframe
    //     var $iframe =  app.tabs.$contentZone.find(".active iframe");
    //     var $span = app.tabs.$titlesZone.find(".active span");
    //     // 存在的话就在这个iframe里打开，不存在的话就先打开一个
    //     if ($iframe.length !== 0) {
    //         $iframe.attr("src", url);
    //         $span.text(title);
    //         return;
    //     }
    // }

    hasCloseButton = hasCloseButton === undefined || hasCloseButton === true;// 默认显示关闭按钮
    var noClose = "";
    if (!hasCloseButton)// 不显示关闭按钮时加上呲样式
        noClose = "noClose";

    // 正常分辨率
    var str1 =
        '<li id="tabs_title_' + id + '">' +
        '<a href="#tabs_content_' + id + '" class="' + noClose + '" data-toggle="tab"><span>' + title + '</span>';
    if (hasCloseButton)// 显示关闭按钮
        str1 += '<i class="fa fa-remove tabs-title-close" onclick="app.tabs.close(\'' + id +'\')"></i>';
    str1 += '</a></li>';
    var str2 = '<div class="tab-pane fade" id="tabs_content_' + id + '">';
    str2 += '<iframe src="' + url + '"></iframe>';
    str2 += '</div>';
    app.tabs.$titlesZone.append(str1);
    app.tabs.$contentZone.append(str2);


    // var tabsA = $('#tabs_title_' + id + ' a');
    // tabsA.data("menu", $(menuObj));
    // tabsA.on('shown.bs.tab', function (e) {
    //     var lteTree = app.menus.$menusZone.children("ul:visible").data("lte.tree");
    //     if (lteTree)
    //         lteTree.toggle($(this).data("menu").parent(), e);
    //     //app.menus.$menusZone.find("ul:visible").data("lte.tree").expand($(this).data("menu"), e);
    // });

    // 打开自动选中
    app.tabs.select(id);
};

/**
 * 选中指定标签页，标签页不存在则返回false，存在返回true
 * @param id
 */
app.tabs.select = function (id) {
    return app.tabs.selectByJqObj($("#tabs_title_" + id));
};

/**
 * 通过jq对象选择标签页
 * @param tabsMenu jq对象（li的jq对象）
 * @returns {boolean}
 */
app.tabs.selectByJqObj = function (tabsMenu) {
    if (tabsMenu.length === 0)
        return false;// 不存在返回false
    tabsMenu.find("a").tab('show');// 调用bootstrap的方法显示指定标签页
    app.tabs.$scrollZone[0].scrollLeft = tabsMenu[0].offsetLeft;// 滚动条滚动到最后
    return true;
};

/**
 * 关闭指定标签页
 * @param id
 */
app.tabs.close = function (id) {
    // 获取待删除的标签页li
    var thisLi = $("#tabs_title_" + id);

    // 在当要关闭的标签页不是已显示的标签页时，才在关闭后切换标签页
    var nextLi = null;
    if (thisLi.hasClass("active")) {
        // 获取下一个，下一个不存在则获取上一个
        nextLi = thisLi.next();
        if (nextLi.length === 0) {
            nextLi = thisLi.prev();
        }
    }

    // 删除
    thisLi.remove();
    $("#tabs_content_" + id).remove();

    // 存在下一个则选中
    if (nextLi !== null && nextLi.length !== 0) {
        app.tabs.selectByJqObj(nextLi);
    }
};
/**
 * 向后滚动
 * @param range 距离
 */
app.tabs.scrollTo = function (range) {
    app.tabs.$scrollZone[0].scrollLeft = app.tabs.$scrollZone[0].scrollLeft + range;
};

// =========================================
// menus 菜单
// =========================================


// 菜单数据模型，数据结构不同可修改对应的值
app.menus.defaultData = {
    id:"id",// 表示是菜单id的属性名
    parent:"parent",// 表示是父菜单id的属性名
    icon:"icon",// 表示是图标class的属性名
    title:"title",// 表示是标题的属性名
    url: "url",// 表示是url的属性名
    subMenu: "subMenu"// 表示是子菜单的属性名
};




app.menus.$menusZone = null;// 菜单区域
app.menus.$titleZone = null;// 广字型菜单的一级菜单区域
app.menus.$titlesZone = null;// 广字型菜单的一级菜单区域下的ui（直接存放li的区域）


/**
 * 初始化菜单
 * @param menusZone 菜单区域的jq选择器
 * @param titlesId 广字型菜单，一级菜单所在的区域jq选择器，可选
 */
app.menus.init = function (menusZone, titlesId) {
    app.menus.$menusZone = $(menusZone);
    if (titlesId) {
        app.menus.$titleZone = $(titlesId);
        if (app.menus.$titleZone.length !== 0) {
            app.menus.$titleZone.append('<ul class="nav navbar-nav"></ul>');
            app.menus.$titlesZone = app.menus.$titleZone.find("ul");
        } else {
            app.menus.$titlesZone = null;
        }
    }
};
app.menus.loadByUrl = function (url) {

};
app.menus.loadByData = function (data) {

    // 数据解析
    data = app.menus.parseMenuDate(data, app.menus.defaultData.id, app.menus.defaultData.subMenu, app.menus.defaultData.parent);


    // 判断是不是广字型
    if (app.menus.$titlesZone !== null && app.menus.$titlesZone.length !== 0) {
        // 广字型菜单
        var titleStr = "";
        var menusStr = "";

        // 遍历一级菜单
        for (var i = 0, temp; i < data.length; ++i) {
            temp = data[i];// 一级菜单
            if (temp[app.menus.defaultData.subMenu]) {
                titleStr += '<li><a href="#menuZone_' + temp[app.menus.defaultData.id] + '" data-toggle="tab">' + temp[app.menus.defaultData.title] + '</a></li>';
                menusStr += '<div id="menuZone_' + temp[app.menus.defaultData.id] + '" class="tab-pane fade"><ul class="sidebar-menu" data-widget="tree" data-animation-speed="200">' + app.menus.dataAppend(temp[app.menus.defaultData.subMenu]) + '</ul></div>';
            } else {
                titleStr += '<li><a href="javascript:void(0)"';
                if (temp[app.menus.defaultData.url]) {
                    titleStr += ' onclick="app.tabs.open(\'';
                    titleStr += temp[app.menus.defaultData.id];
                    titleStr += '\',\'';
                    if (temp[app.menus.defaultData.title])
                        titleStr += temp[app.menus.defaultData.title];
                    titleStr += '\',\'' + temp[app.menus.defaultData.url] + '\'';
                    titleStr += ',this';
                    titleStr += ');"';
                }
                titleStr += '>';
                if (temp[app.menus.defaultData.title])
                    titleStr += temp[app.menus.defaultData.title];
                titleStr += '</a></li>';
            }


        }
        app.menus.$titlesZone.append(titleStr);
        app.menus.$menusZone.append(menusStr);

        // 选中第一个菜单
        app.menus.$titlesZone.children("li").first().children("a").tab('show');
    } else {
        // 非广字型菜单
        app.menus.$menusZone.append('<ul class="sidebar-menu" data-widget="tree" data-animation-speed="200">' + app.menus.dataAppend(data) + '</ul>');
    }
};



/**
 * 生成向菜单区域中插入的内容
 * @param data
 * @returns {string}
 */
app.menus.dataAppend = function (data) {
    var str = "";
    for (var i = 0, temp; i < data.length; ++i) {
        temp = data[i];// 一个菜单对象

        // 菜单必须有id，应该不用判断了
        // if (!temp[app.menus.defaultData.id])
        //     continue;

        str += '<li';
        if (temp[app.menus.defaultData.subMenu])
            str += ' class="treeview"';
        str += '>';
        str += '<a href="javascript:void(0)"';
        if (temp[app.menus.defaultData.url] && !temp[app.menus.defaultData.subMenu]) {
            str += ' onclick="app.tabs.open(\'';
            str += temp[app.menus.defaultData.id];
            str += '\',\'';
            if (temp[app.menus.defaultData.title])
                str += temp[app.menus.defaultData.title];
            str += '\',\'' + temp[app.menus.defaultData.url] + '\'';
            str += ',this';
            str += ');"';
        }
        str += '>';
        if (temp[app.menus.defaultData.icon])
            str += '<i class="' + temp[app.menus.defaultData.icon] + '"></i>';
        if (temp[app.menus.defaultData.title])
            str += "<span>" + temp[app.menus.defaultData.title] + "</span>";
        if (temp[app.menus.defaultData.subMenu])
            str += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
        str += '</a>';

        if (temp[app.menus.defaultData.subMenu]) {
            // 有下级菜单
            str += '<ul class="treeview-menu">';
            str += app.menus.dataAppend(temp[app.menus.defaultData.subMenu]);
            str += '</ul>';
        }
        str += '</li>';
    }
    return str;
};


/**
 * 解析菜单数据，一级转多级
 * @param data
 * @param idStr
 * @param subMenuStr
 * @param parentStr
 * @returns {Array}
 */
app.menus.parseMenuDate =  function(data, idStr,  subMenuStr, parentStr) {
    var menuData = [];
    if (!subMenuStr) subMenuStr = "subMenu";
    if (!parentStr) parentStr = "parent";
    if (!idStr) idStr = "id";

    function getmenuData(arr, str, ziStr) {
        var temp = null;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i][idStr] === str)
                return arr[i];
            if (arr[i][ziStr] && arr[i][ziStr].length !== 0)
                temp = getmenuData(arr[i][ziStr], str, ziStr);
            if (temp)
                return temp;
        }
    }

    for (var i = 0; i < data.length; ++i) {
        var temp = data[i];
        if (temp[parentStr]) {
            var foo = getmenuData(menuData, temp[parentStr], subMenuStr);
            if (!foo) {
                foo = getmenuData(data, temp[parentStr], subMenuStr);
                if (!foo)
                    continue;
            }
            if (!foo[subMenuStr])
                foo[subMenuStr] = [];
            foo[subMenuStr].push(temp);
        } else
            menuData.push(temp);
    }
    return menuData;
};