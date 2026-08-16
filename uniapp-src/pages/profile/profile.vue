<template>
  <!-- 恒大文旅城 邻里拼车 个人中心 (Vue3 + TypeScript + UnoCSS) -->
  <view class="profile-container">
    <!-- 用户个人资料卡片 (开放无门槛) -->
    <view class="user-card">
      <image class="avatar-lg" :src="profile.avatar" mode="aspectFill" />
      <view class="user-meta">
        <view class="name-row">
          <text class="user-name-lg">{{ profile.name }}</text>
          <text class="tag-badge">{{ profile.communityPhase || '文旅城邻居' }}</text>
        </view>
        <text class="user-phone">联系电话：{{ profile.phone }}</text>
        <text class="user-sub">常用出发地：{{ profile.defaultOrigin || '文旅城星空门岗 / 1~4期' }}</text>
      </view>
    </view>

    <!-- 常用设置与车辆信息 (完全自愿选填，无强制认证) -->
    <view class="content-card">
      <view class="card-header">
        <text class="card-title">🚗 我的拼车偏好与车辆 (选填)</text>
      </view>
      
      <view class="info-row">
        <text class="info-label">常用昵称：</text>
        <text class="info-val">{{ profile.name }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">我的车辆：</text>
        <text class="info-val">{{ profile.carModel ? profile.carModel + ' (' + profile.carPlate + ')' : '暂未设置（发车时可直接输入）' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">顺路意向：</text>
        <text class="info-val text-emerald">高新软件新城 / 地铁2号线 / 经开区</text>
      </view>
    </view>

    <!-- 快捷功能菜单 -->
    <view class="menu-card">
      <view class="menu-item" @click="handleCopyWeChat">
        <view class="menu-left">
          <text class="menu-icon">💬</text>
          <text class="menu-text">加入文旅城拼车微信群</text>
        </view>
        <view class="menu-right">
          <text class="menu-sub">复制群主微信</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="menu-item" @click="showCharter">
        <view class="menu-left">
          <text class="menu-icon">📜</text>
          <text class="menu-text">0元公益互助公约与安全提示</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <view class="menu-item" @click="goToMyTrips">
        <view class="menu-left">
          <text class="menu-icon">🎫</text>
          <text class="menu-text">查看我的行程与 6 位核验码</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 底部版权/背景声明 -->
    <view class="footer-info">
      <text class="footer-title">恒大文化旅游城 · 邻里顺路拼车</text>
      <text class="footer-desc">0元公益互助 · 开放自由发布 · 邻里通勤互帮互助</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface UserCarpoolProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  communityPhase: string;
  defaultOrigin: string;
  carModel?: string;
  carPlate?: string;
}

const profile = reactive<UserCarpoolProfile>({
  id: 'user-me',
  name: '张先生',
  phone: '138****9527',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  communityPhase: '恒大文旅城2期',
  defaultOrigin: '2期星空门岗',
  carModel: '比亚迪 汉',
  carPlate: '陕A·88888',
});

const handleCopyWeChat = () => {
  uni.setClipboardData({
    data: 'hd_wlc_carpool',
    success: () => {
      uni.showToast({
        title: '已复制群微信号',
        icon: 'success',
      });
    },
  });
};

const showCharter = () => {
  uni.showModal({
    title: '恒大文旅城 邻里拼车互助公约',
    content: '1. 本程序旨在为文旅城及周边邻里提供 0 元顺路互助通勤信息撮合。\n2. 严禁任何形式的商业非法营运。\n3. 车主与乘客请准时赴约，文明互助，共同维护良好的邻里互信环境。',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#059669',
  });
};

const goToMyTrips = () => {
  uni.switchTab({
    url: '/pages/my-trips/my-trips',
  });
};
</script>

<style scoped>
.profile-container {
  padding: 16px;
  background-color: #F8FAFC;
  min-height: 100vh;
  box-sizing: border-box;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #059669, #0d9488);
  border-radius: 20px;
  padding: 20px;
  color: #FFFFFF;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
}

.avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.user-meta {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.user-name-lg {
  font-size: 18px;
  font-weight: bold;
}

.tag-badge {
  font-size: 11px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
}

.user-phone {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.user-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  display: block;
}

.content-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #E2E8F0;
}

.card-header {
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: #1E293B;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-label {
  color: #64748B;
  width: 80px;
}

.info-val {
  color: #334155;
  flex: 1;
}

.text-emerald {
  color: #059669;
  font-weight: 500;
}

.menu-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin-bottom: 24px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F1F5F9;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  font-size: 16px;
}

.menu-text {
  font-size: 14px;
  color: #1E293B;
  font-weight: 500;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-sub {
  font-size: 12px;
  color: #059669;
}

.arrow {
  font-size: 18px;
  color: #94A3B8;
}

.footer-info {
  text-align: center;
  padding: 10px 0;
}

.footer-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  display: block;
}

.footer-desc {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 4px;
  display: block;
}
</style>
