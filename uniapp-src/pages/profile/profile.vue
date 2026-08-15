<template>
  <!-- 恒大文旅城 业主中心 uni-app Vue3 -->
  <view class="container">
    <!-- 业主认证卡片 -->
    <view class="user-card">
      <image class="avatar-lg" :src="owner.avatar" mode="aspectFill" />
      <view class="user-meta">
        <view class="name-row">
          <text class="user-name-lg">{{ owner.name }}</text>
          <text class="verify-badge">已实名业主</text>
        </view>
        <text class="user-phase-lg">{{ owner.communityPhase }} · {{ owner.buildingUnit }}</text>
        <text class="user-phone">{{ owner.phone }}</text>
      </view>
    </view>

    <!-- 车辆绑定信息 -->
    <view class="content-card">
      <text class="card-title">🚙 我的爱车 (车主认证)</text>
      <view class="info-row">
        <text class="info-label">车型：</text>
        <text class="info-val">{{ owner.carModel }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">车牌：</text>
        <text class="info-val">{{ owner.carPlate }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">信用：</text>
        <text class="info-val text-emerald">恒大文旅城邻里互助积分 {{ owner.creditScore }} 分</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="menu-card">
      <view class="menu-item" @click="handleCopyWeChat">
        <text class="menu-text">💬 加入恒大文旅城业主拼车微信群</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="showCharter">
        <text class="menu-text">📜 0元公益互助公约与免责声明</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="footer-info">
      <text>西安恒大文化旅游城 业主互助委员会 · uni-app TS 版</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { OwnerProfile } from '@/types/carpool';

const owner = reactive<OwnerProfile>({
  id: 'user-me',
  name: '张先生',
  phone: '138****9527',
  communityPhase: '恒大文旅城·2期',
  buildingUnit: '18号楼 2单元 1602',
  isVerifiedOwner: true,
  creditScore: 100,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  carModel: '比亚迪 汉EV · 极夜黑',
  carPlate: '陕A·D***8'
});

function handleCopyWeChat(): void {
  uni.showModal({
    title: '恒大文旅城拼车微信群',
    content: '请添加群管理员微信：hd_wlc_admin\n核验房号后邀请进入本期邻里拼车群。',
    confirmText: '复制微信号',
    confirmColor: '#059669',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'hd_wlc_admin',
          success: () => {
            uni.showToast({ title: '已复制微信号' });
          }
        });
      }
    }
  });
}

function showCharter(): void {
  uni.showModal({
    title: '0元公益互助公约',
    content: '1. 本小程序专供恒大文旅城业主互助通勤。\n2. 全程0元互助，严禁收取任何拼车费用。\n3. 车主与合乘人互相尊重，安全文明出行。',
    showCancel: false,
    confirmText: '我已遵守',
    confirmColor: '#059669'
  });
}
</script>

<style scoped>
.container {
  padding: 24rpx;
}
.user-card {
  padding: 32rpx;
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  border-radius: 28rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.avatar-lg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  margin-right: 24rpx;
}
.name-row {
  display: flex;
  align-items: center;
}
.user-name-lg {
  font-size: 32rpx;
  font-weight: bold;
}
.verify-badge {
  font-size: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  margin-left: 16rpx;
}
.user-phase-lg {
  font-size: 24rpx;
  color: #D1FAE5;
  margin-top: 8rpx;
  display: block;
}
.user-phone {
  font-size: 22rpx;
  color: #A7F3D0;
  margin-top: 4rpx;
  display: block;
}
.content-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #1E293B;
  display: block;
}
.info-row {
  font-size: 26rpx;
  margin-bottom: 12rpx;
  display: flex;
}
.info-label {
  color: #64748B;
  width: 120rpx;
}
.info-val {
  color: #0F172A;
  font-weight: 500;
}
.text-emerald {
  color: #059669;
}
.menu-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 0 24rpx;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #F1F5F9;
  font-size: 26rpx;
}
.menu-item:last-child {
  border-bottom: none;
}
.arrow {
  color: #94A3B8;
  font-size: 32rpx;
}
.footer-info {
  text-align: center;
  margin-top: 40rpx;
  font-size: 22rpx;
  color: #94A3B8;
}
</style>
