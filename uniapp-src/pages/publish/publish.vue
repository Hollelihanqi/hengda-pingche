<template>
  <!-- 恒大文旅城 发布拼车 uni-app Vue3 -->
  <view class="container">
    <!-- 模式选择 -->
    <view class="type-switch">
      <view 
        class="type-btn" 
        :class="{ active: formData.type === 'driver_offer' }" 
        @click="formData.type = 'driver_offer'"
      >
        🚗 我是车主 · 发布空位 (车找人)
      </view>
      <view 
        class="type-btn" 
        :class="{ active: formData.type === 'passenger_request' }" 
        @click="formData.type = 'passenger_request'"
      >
        🙋 我是乘客 · 寻找顺路车 (人找车)
      </view>
    </view>

    <!-- 表单主体 -->
    <view class="form-card">
      <view class="form-item">
        <text class="label">出发地点 (文旅城门岗)</text>
        <input class="input" v-model="formData.origin" placeholder="如：恒大文旅城2期 星空门岗" />
      </view>

      <view class="form-item">
        <text class="label">到达目的地</text>
        <input class="input" v-model="formData.destination" placeholder="如：高新区 软件新城 / 运动公园地铁" />
      </view>

      <view class="form-item flex-between">
        <text class="label">出发日期</text>
        <picker mode="date" :value="formData.departureDate" @change="onDateChange">
          <view class="picker-val">{{ formData.departureDate }}</view>
        </picker>
      </view>

      <view class="form-item flex-between">
        <text class="label">发车时间</text>
        <picker mode="time" :value="formData.departureTime" @change="onTimeChange">
          <view class="picker-val">{{ formData.departureTime }}</view>
        </picker>
      </view>

      <view class="form-item flex-between">
        <text class="label">{{ formData.type === 'driver_offer' ? '提供空余座位' : '乘车人数' }}</text>
        <picker mode="selector" :range="[1, 2, 3, 4]" :value="formData.seats - 1" @change="onSeatsChange">
          <view class="picker-val">{{ formData.seats }} 位</view>
        </picker>
      </view>

      <view class="form-item" v-if="formData.type === 'driver_offer'">
        <text class="label">车辆信息 (认证绑定)</text>
        <input class="input" :value="`${formData.carModel} (${formData.carPlate})`" disabled />
      </view>

      <view class="form-item">
        <text class="label">补充留言与偏好</text>
        <input class="input" v-model="formData.note" placeholder="如：准时出发、走绕城高速ETC、禁烟" />
      </view>
    </view>

    <!-- 互助提醒 -->
    <view class="notice-card">
      <text class="notice-title">🛡️ 恒大文旅城邻里0元互助声明：</text>
      <text class="notice-text">本小程序专为文旅城业主通勤互助撮合，全程 0 元免费，严禁线下非法收费。</text>
    </view>

    <button class="btn-submit" @click="handleSubmit">确认发布拼车行程</button>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { CarpoolTrip } from '@/types/carpool';

interface FormDataState {
  type: 'driver_offer' | 'passenger_request';
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  seats: number;
  routeHighway: string;
  carModel: string;
  carPlate: string;
  note: string;
}

const formData = reactive<FormDataState>({
  type: 'driver_offer',
  origin: '恒大文旅城 2期 星空门岗',
  destination: '高新区 软件新城 (环普科技园)',
  departureDate: '2026-08-16',
  departureTime: '07:30',
  seats: 3,
  routeHighway: '正阳大道 ➔ 绕城高速 (高新通道)',
  carModel: '比亚迪 汉EV · 极夜黑',
  carPlate: '陕A·D***8',
  note: ''
});

function onDateChange(e: any): void {
  formData.departureDate = e.detail.value;
}

function onTimeChange(e: any): void {
  formData.departureTime = e.detail.value;
}

function onSeatsChange(e: any): void {
  formData.seats = Number(e.detail.value) + 1;
}

function handleSubmit(): void {
  if (!formData.origin.trim() || !formData.destination.trim()) {
    uni.showToast({ title: '请填写起终点', icon: 'none' });
    return;
  }

  const newTrip: CarpoolTrip = {
    id: 'trip-' + Date.now(),
    type: formData.type,
    publisher: {
      id: 'user-me',
      name: '张先生',
      phone: '138****9527',
      communityPhase: '恒大文旅城·2期',
      buildingUnit: '18号楼 2单元 1602',
      isVerifiedOwner: true,
      creditScore: 100,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    departureDate: formData.departureDate,
    departureTime: formData.departureTime,
    origin: { name: formData.origin, address: formData.origin },
    destination: { name: formData.destination, address: formData.destination },
    routeHighway: formData.routeHighway,
    availableSeats: formData.seats,
    totalSeats: formData.seats,
    preferences: ['0元公益互助', '文旅城业主', '准点发车'],
    carModel: formData.type === 'driver_offer' ? formData.carModel : undefined,
    carPlate: formData.type === 'driver_offer' ? formData.carPlate : undefined,
    note: formData.note || '文旅城邻里早高峰通勤，准点出发。',
    bookings: []
  };

  const trips: CarpoolTrip[] = uni.getStorageSync('hd_trips') || [];
  trips.unshift(newTrip);
  uni.setStorageSync('hd_trips', trips);

  uni.showToast({
    title: '发布成功！',
    icon: 'success',
    duration: 2000
  });

  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }, 1000);
}
</script>

<style scoped>
.container {
  padding: 24rpx;
}
.type-switch {
  margin-bottom: 24rpx;
}
.type-btn {
  background: #FFFFFF;
  border: 2rpx solid #E2E8F0;
  border-radius: 20rpx;
  padding: 24rpx;
  font-size: 26rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16rpx;
  color: #64748B;
}
.type-btn.active {
  border-color: #059669;
  background: #ECFDF5;
  color: #059669;
}
.form-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.form-item {
  margin-bottom: 28rpx;
  border-bottom: 1rpx solid #F1F5F9;
  padding-bottom: 20rpx;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 26rpx;
  font-weight: bold;
  color: #1E293B;
  display: block;
  margin-bottom: 12rpx;
}
.input {
  font-size: 26rpx;
  color: #0F172A;
  width: 100%;
}
.picker-val {
  font-size: 26rpx;
  color: #059669;
  font-weight: bold;
}
.notice-card {
  background: #FEF3C7;
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 32rpx;
}
.notice-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #92400E;
  display: block;
}
.notice-text {
  font-size: 22rpx;
  color: #B45309;
  margin-top: 4rpx;
  display: block;
  line-height: 1.4;
}
.btn-submit {
  background: #059669;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: bold;
  border-radius: 24rpx;
  padding: 24rpx 0;
  border: none;
  box-shadow: 0 8rpx 16rpx rgba(5, 150, 105, 0.25);
}
</style>
