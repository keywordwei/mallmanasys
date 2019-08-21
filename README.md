# 校园淘后台管理系统 前端React代码
## 项目描述
- 因小组共同开发了一个发布二手商品的网站，故为了练习react而独立实现了这一后台管理系统。系统可对商品信息、商品一级分类、商品二级分类、员工信息、员工权限设置进行管理。
## 项目具体实现功能
- 首页：对商品数量、员工人数、商品分类数进行了展示，点击可导航至相应页面；头部根据用户当前城市显示相应天气状况，同时对用户名进行展示。
- 商品分类：含一级分类和二级分类，均可对分类进行增删改操作，同时涵盖功能全面分页导航功能。
- 商品管理：可对商品进行增删改查排序功能；添加商品时可上传图片，由于富文本的存在，可实现更详尽的商品描述，诸如上传视频、图片、emoil等操作；对商品信息进行了全面的展示，同时可直接操作商品的上架/下架状态；可以根据商品一级分类名称、商品名称，商品详情查询商品，同时可根据商品价格，商品点击量对商品进行排序，当排序存在时，查询商品时也会默认按当前排序方式对商品排序；一键重置将使查询方式恢复成默认方式。（当然此后台系统发布的商品默认为管理人员发布的商品，管理系统人员同时存在于员工表和用户表中）
- 员工管理：可创建员工，修改员工信息（不含密码），删除员工，未做忘记密码功能(实则做修改员工信息的同时可对密码进行修改)，展示的密码为md5加密后的32为字符，同时显示员工处于何种角色。
- 角色设置：可设置系统存在多种角色(类似职位)，每种角色对该系统有着不同的权限(即每种角色只能访问权限内的页面)
- 图表功能：未与后台结合，仅为了解echarts图表可视化而做的一次展示。
- 地址：将呈现当前用户所在城市地图信息。
## 使用的技术
- 前端： `react`、`react-router-dom`、`antd`、`axios`、`braft-react`、`echarts-for-react`、百度地图api
- 后台： `node + express + mysql` 搭建后台
## 技术细节
- 每个管理信息的图表都使用了不同的实现方式。商品一级分类和二级分类使用的是一个组件，同过用户点击是否查看子分类来判断表格该渲染的数据，以及相关的操作。
商品管理注册了3个组件，分别商品详情、添加/修改商品、查看商品，是功能最丰富的一个模块。
- 使用jsonp解决请求天气跨域问题；利用了百度地图api实现ip定位显示地图；echarts-for-react实现图表功能；利用`braft-react`实现富文本功能，可上传删除media文件，视频封面由后端通过`fluent-ffmpeg`抓取视频某一时刻帧后的图片地址返回给前端；
- 暂未用`redux`、`react-redux` `redux-thunk`对数据进行管理。
