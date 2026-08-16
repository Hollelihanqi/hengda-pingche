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

      <view class="meta-row" v-if="trip.price">
        <text class="meta-label">分摊车费：</text>
        <text class="meta-val text-amber font-bold">¥{{ trip.price }}/位</text>
      </view>

      <view class="meta-row">
        <text class="meta-label">剩余席位：</text>
        <text class="meta-val text-emerald font-bold">{{ trip.availableSeats }} 席</text>
      </view>

      <view class="meta-row" v-if="trip.carModel">
        <text class="meta-label">车辆信息：</text>
        <text class="meta-val">{{ trip.carModel }}</text>
      </view>

      <!-- 发布者信息与拨打电话 (页面不暴露明文号码，点击直接呼叫) -->
      <view class="publisher-bar">
        <view class="pub-left">
          <image class="pub-avatar" :src="trip.publisher.avatar" mode="aspectFill" />
          <view class="pub-info">
            <text class="pub-name">{{ trip.publisher.name }}</text>
            <text class="pub-phase">{{ trip.publisher.communityPhase }}</text>
          </view>
        </view>
        <button class="btn-call" @click="makePhoneCall">📞 拨打电话</button>
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

const makePhoneCall = () => {
  const phone = trip.value?.publisher?.phone || '18729391167';
  uni.makePhoneCall({
    phoneNumber: phone.replace(/[^0-9]/g, '') || '18729391167',
  });
};

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
.text-amber {
  color: #d97706;
}
.publisher-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F1F5F9;
}
.pub-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.pub-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}
.pub-info {
  display: flex;
  flex-direction: column;
}
.pub-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #0F172A;
}
.pub-phase {
  font-size: 20rpx;
  color: #64748B;
}
.btn-call {
  background: #059669;
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: bold;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 60rpx;
  line-height: 60rpx;
}
.btn-share {
  background: #0F172A;
  color: #FFFFFF;
  font-weight: bold;
  font-size: 28rpx;
  border-radius: 24rpx;
  margin-top: 30rpx;
  padding: 24rpx 0;
  border: none;
}
</style>
