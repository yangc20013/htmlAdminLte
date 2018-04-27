app.menus.init('#menusContent');
app.tabs.init('#tabs_title', '#tabs_content');


app.tabs.open('default', "首页", 'components/default.html', null, false);

var menuData = [
    {
        id: 1,
        title: "系统管理"
    }, {
        id: 2,
        title: "用户管理"
    }, {
        id: 3,
        title: "系统日志",
        parent: 1,
        url: "components/default.html",
        icon: "fa fa-circle-o"
    }, {
        id: 4,
        title: "新增用户",
        parent: 2,
        url: "components/user/add.html",
        icon: "fa fa-circle-o"
    }, {
        id: 5,
        title: "用户查询",
        parent: 2,
        url: "components/user/index.html",
        icon: "fa fa-circle-o"
    }, {
        id: 6,
        title: "字典管理",
        url: "components/user/add.html"
    }, {
        id: 7,
        title: "系统日志",
        url: "components/test.html"
    }
];

app.menus.loadByData(menuData);