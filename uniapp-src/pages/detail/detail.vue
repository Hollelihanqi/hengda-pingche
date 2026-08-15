<template>
  <!-- 恒大文旅城 拼车详情 uni-app Vue3 -->
  <view class="container" v-if="trip">
    <view class="detail-card">
      <view class="header-row">
        <text class="type-tag" :class="trip.type === 'driver_offer' ? 'green' : 'blue'">
          {{ trip.type === 'driver_offer' ? '🚗 车找人 (车主发车)' : '🙋 人找车 (求拼车)' }}
        </text>
        <text class="time-lg">{{ trip.departureTime }} 出发</text>
      </view>

      <view class="route-box-lg">
        <view class="point-lg">🟢 出发：{{ trip.origin.name }}</view>
        <view class="point-lg font-bold">🔴 目的：{{ trip.destination.name }}</view>
      </view>

      <view class="meta-row">
        <text class="meta-label">途经主干：</text>
        <text class="meta-val">{{ trip.routeHighway }}</text>
      </view>

      <view class="meta-row">
        <text class="meta-label">剩余席位：</text>
        <text class="meta-val text-emerald font-bold">{{ trip.availableSeats }} 席</text>
      </view>

      <view class="meta-row" v-if="trip.carModel">
        <text class="meta-label">车辆信息：</text>
        <text class="meta-val">{{ trip.carModel }} ({{ trip.carPlate }})</text>
      </view>

      <view class="meta-row">
        <text class="meta-label">车主留言：</text>
        <text class="meta-val">{{ trip.note }}</text>
      </view>
    </view>

    <button class="btn-share" open-type="share">转发此行程至文旅城微信群</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import type { CarpoolTrip } from '@/types/carpool';

const trip = ref<CarpoolTrip | null>(null);

onLoad((options: any) => {
  const id = options?.id;
  const trips: CarpoolTrip[] = uni.getStorageSync('hd_trips') || [];
  const found = trips.find(t => t.id === id) || trips[0];
  trip.value = found || null;
});

onShareAppMessage(() => {
  return {
    title: `【恒大文旅城拼车】${trip.value?.departureTime} ${trip.value?.origin.name} ➔ ${trip.value?.destination.name}`,
    path: `/pages/detail/detail?id=${trip.value?.id}`
  };
});
</script>

<style scoped>
.container {
  padding: 24rpx;
}
.detail-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.type-tag {
  font-size: 22rpx;
  font-weight: bold;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}
.type-tag.green { background: #ECFDF5; color: #059669; }
.type-tag.blue { background: #EFF6FF; color: #2563EB; }
.time-lg {
  font-size: 28rpx;
  font-weight: bold;
  color: #0F172A;
}
.route-box-lg {
  margin: 28rpx 0;
  padding: 24rpx;
  background: #F8FAFC;
  border-radius: 20rpx;
  font-size: 28rpx;
  line-height: 2;
}
.font-bold {
  font-weight: bold;
}
.meta-row {
  font-size: 26rpx;
  margin-bottom: 16rpx;
  display: flex;
}
.meta-label {
  color: #64748B;
  width: 150rpx;
}
.meta-val {
  color: #1E293B;
  flex: 1;
}
.text-emerald {
  color: #059669;
}
.btn-share {
  background: #059669;
  color: #FFFFFF;
  font-weight: bold;
  font-size: 28rpx;
  border-radius: 24rpx;
  margin-top: 40rpx;
  padding: 24rpx 0;
  border: none;
}
</style>
