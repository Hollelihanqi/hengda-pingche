# 微信小程序云函数后端（免服务器部署）

本项目原生支持 **微信小程序云开发（Cloud Functions）**，所有拼车业务（查询、发车、预约、下架、统计）均通过云函数直连微信云数据库，**无需购买服务器、无需配置域名与 SSL 证书、无需 ICP 备案**。

---

## 一、云函数列表与功能

| 云函数目录 | 函数名 | 功能说明 | 核心入参 |
| :--- | :--- | :--- | :--- |
| `cloudfunctions/getTrips/` | `getTrips` | 获取拼车列表（支持按车找人/人找车、方向、日期、关键字筛选及分页） | `type`, `direction`, `date`, `keyword`, `page` |
| `cloudfunctions/publishTrip/`| `publishTrip` | 发布拼车行程（自动获取 `OPENID` 存入 `carpool_trips` 集合） | `type`, `origin`, `destination`, `departureDate`, `departureTime`, `phone`, `totalSeats` |
| `cloudfunctions/bookTrip/` | `bookTrip` | 预约拼车座位（扣减剩余座位，生成 6 位乘车核销码） | `tripId`, `passengerName`, `passengerPhone`, `seatsBooked` |
| `cloudfunctions/cancelTrip/` | `cancelTrip` | 下架/取消拼车（校验发布人 `OPENID` 权限） | `tripId` |
| `cloudfunctions/getStats/` | `getStats` | 拼车大厅动态统计（发车数、预约人数、减碳量） | 无 |

---

## 二、微信开发者工具 3步极速部署流程

### 第 1 步：开通云开发环境
1. 用 **微信开发者工具** 打开本项目根目录；
2. 点击顶部工具栏的 **「云开发」** 按钮，按提示开通云开发环境（免费基础版即可）；
3. 复制你的 **云环境 ID**（例如 `carpool-prod-xxxxxx`）。

### 第 2 步：创建云数据库集合
1. 在微信开发者工具中打开 **「云开发控制台」➔「数据库」**；
2. 点击 **「添加集合」**，输入集合名称：`carpool_trips`；
3. 将集合权限设置为 **「所有用户可读，仅创建者可写」**（或「自定义安全规则」）。

### 第 3 步：一键上传并部署云函数
1. 在微信开发者工具左侧目录树中，展开 `cloudfunctions` 文件夹；
2. 依次右键点击每个函数文件夹（`getTrips`, `publishTrip`, `bookTrip`, `cancelTrip`, `getStats`）；
3. 选择 **「上传并部署：云端安装依赖（不上传 node_modules）」**；
4. 等待 5~10 秒提示“部署成功”后，微信小程序即已完全拥有独立可用的云后端！

---

## 三、小程序前端调用示例

在微信小程序页面（或 Uni-app 编译产物）中直接调用：

```javascript
// 1. 查询拼车列表
wx.cloud.callFunction({
  name: 'getTrips',
  data: {
    type: 'driver_offer',   // 车找人
    direction: 'into_city', // 进城
    keyword: '高新',
  },
  success: (res) => {
    console.log('拼车列表:', res.result.data);
  }
});

// 2. 发布拼车
wx.cloud.callFunction({
  name: 'publishTrip',
  data: {
    type: 'driver_offer',
    direction: 'into_city',
    departureDate: '2026-08-17',
    departureTime: '07:30',
    origin: { name: '恒大文旅城·1期星空门岗' },
    destination: { name: '高新·软件新城' },
    totalSeats: 3,
    phone: '18729391167',
    publisherName: '林先生',
  },
  success: (res) => {
    wx.showToast({ title: '发车成功' });
  }
});

// 3. 预约拼车
wx.cloud.callFunction({
  name: 'bookTrip',
  data: {
    tripId: 'trip_1723829100_abc',
    passengerName: '张女士',
    passengerPhone: '13800138000',
    seatsBooked: 1,
  },
  success: (res) => {
    console.log('核销码:', res.result.data.booking.boardingCode);
  }
});
```
