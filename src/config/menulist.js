const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        isPublic: true // 公开的
    },
    {
        title: '商品',
        key: '/products',
        icon: 'appstore',
        children: [
            // 子菜单列表
            {
                title: '品类管理',
                key: '/products/category',
                icon: 'bars'
            },
            {
                title: '商品管理',
                key: '/products/product',
                icon: 'tool'
            }
        ]
    },
    {
        title: '员工管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '权限设置',
        key: '/role',
        icon: 'safety'
    },
    {
        title: '可视化数据',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: 'pie-chart'
            }
        ]
    },
    {
        title: '地址',
        key: '/address',
        icon: 'environment'
    },
];

export default menuList;
