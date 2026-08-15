<template>
  <!-- 恒大文旅城 拼车大厅 uni-app Vue3 -->
  <view class="container">
    <!-- 顶部宣传卡片 -->
    <view class="banner-card">
      <view class="banner-badge-row">
        <text class="banner-tag">🏰 文旅城业主通勤专线</text>
        <text class="free-badge">0元公益互助</text>
      </view>
      <view class="banner-title">早晚高峰 · 邻里拼车大厅</view>
      <view class="banner-desc">覆盖恒大文旅城 1~4 期，直达高新软件新城、经开及地铁 2 号线接驳。</view>
      <button class="btn-publish" @click="goToPublish">+ 发布发车 / 求拼</button>
    </view>

    <!-- 搜索筛选 -->
    <view class="search-box">
      <input 
        class="search-input" 
        placeholder="搜索目的地（如：软件新城 / 运动公园）" 
        v-model="searchKeyword"
      />
    </view>

    <!-- 类型切换 Tab -->
    <view class="type-tabs">
      <view 
        class="tab-item" 
        :class="{ active: filterType === 'all' }" 
        @click="filterType = 'all'"
      >全部</view>
      <view 
        class="tab-item" 
        :class="{ active: filterType === 'driver_offer' }" 
        @click="filterType = 'driver_offer'"
      >🚗 车找人</view>
      <view 
        class="tab-item" 
        :class="{ active: filterType === 'passenger_request' }" 
        @click="filterType = 'passenger_request'"
      >🙋 人找车</view>
    </view>

    <!-- 列表区域 -->
    <view class="trip-list">
      <view 
        v-for="item in filteredTrips" 
        :key="item.id" 
        class="trip-card"
        @click="goToDetail(item.id)"
      >
        <!-- 头部 -->
        <view class="card-header">
          <view class="publisher-info">
            <image class="avatar" :src="item.publisher.avatar" mode="aspectFill" />
            <view class="user-meta">
              <text class="user-name">{{ item.publisher.name }}</text>
              <text class="user-phase">{{ item.publisher.communityPhase }}</text>
            </view>
          </view>
          <view class="time-badge">
            <text class="time-text">{{ item.departureTime }} 出发</text>
          </view>
        </view>

        <!-- 路线 -->
        <view class="route-box">
          <view class="route-point">
            <text class="dot dot-green"></text>
            <text class="point-name">{{ item.origin.name }}</text>
          </view>
          <view class="route-line"></view>
          <view class="route-point">
            <text class="dot dot-red"></text>
            <text class="point-name font-bold">{{ item.destination.name }}</text>
          </view>
        </view>

        <!-- 底部 -->
        <view class="card-footer">
          <text class="route-desc">🛣️ {{ item.routeHighway }}</text>
          <text class="seat-badge">余 {{ item.availableSeats }} 席</text>
        </view>

        <!-- 预约操作 -->
        <view class="action-box" @click.stop>
          <button 
            class="btn-book" 
            :disabled="item.availableSeats <= 0"
            @click="bookTrip(item)"
          >
            {{ item.availableSeats > 0 ? '一键免费预约' : '已满员' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import type { CarpoolTrip, BookingRecord } from '@/types/carpool';

const trips = ref<CarpoolTrip[]>([]);
const filterType = ref<'all' | 'driver_offer' | 'passenger_request'>('all');
const searchKeyword = ref<string>('');

function loadTrips(): void {
  const data = uni.getStorageSync('hd_trips') || [];
  trips.value = data;
}

onShow(() => {
  loadTrips();
});

onPullDownRefresh(() => {
  loadTrips();
  uni.stopPullDownRefresh();
});

const filteredTrips = computed(() => {
  return trips.value.filter(t => {
    const matchType = filterType.value === 'all' || t.type === filterType.value;
    const matchKeyword = !searchKeyword.value || 
      t.destination.name.includes(searchKeyword.value) || 
      t.origin.name.includes(searchKeyword.value);
    return matchType && matchKeyword;
  });
});

function goToPublish(): void {
  uni.switchTab({
    url: '/pages/publish/publish'
  });
}

function goToDetail(id: string): void {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  });
}

function bookTrip(trip: CarpoolTrip): void {
  uni.showModal({
    title: '确认免费预约行程',
    content: `预约 ${trip.departureTime} 从 [${trip.origin.name}] ➔ [${trip.destination.name}]？\n(全程0元公益互助)`,
    confirmText: '立即预约',
    confirmColor: '#059669',
    success: (res) => {
      if (res.confirm) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const newBooking: BookingRecord = {
          id: 'book-' + Date.now(),
          tripId: trip.id,
          passengerId: 'user-me',
          passengerName: '业主张先生',
          passengerPhone: '138****9527',
          seatsBooked: 1,
          boardingCode: code,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          tripTime: trip.departureTime,
          origin: trip.origin.name,
          destination: trip.destination.name
        };

        // 写入预约记录
        const bookings: BookingRecord[] = uni.getStorageSync('hd_my_bookings') || [];
        bookings.unshift(newBooking);
        uni.setStorageSync('hd_my_bookings', bookings);

        // 减少余座
        const all = trips.value.map(t => {
          if (t.id === trip.id) {
            return { ...t, availableSeats: Math.max(0, t.availableSeats - 1) };
          }
          return t;
        });
        uni.setStorageSync('hd_trips', all);
        trips.value = all;

        uni.showToast({
          title: `预约成功！核验码:${code}`,
          icon: 'none',
          duration: 3000
        });
      }
    }
  });
}
</script>

<style scoped>
.container {
  padding: 24rpx;
}
.banner-card {
  background: linear-gradient(135deg, #059669 0%, #0d9488 60%, #0f172a 100%);
  border-radius: 32rpx;
  padding: 32rpx;
  color: #FFFFFF;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(5, 150, 105, 0.2);
}
.banner-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.banner-tag {
  font-size: 22rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.free-badge {
  font-size: 20rpx;
  color: #6EE7B7;
  border: 1rpx solid #6EE7B7;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}
.banner-title {
  font-size: 34rpx;
  font-weight: bold;
  margin-top: 16rpx;
}
.banner-desc {
  font-size: 24rpx;
  color: #D1FAE5;
  margin-top: 8rpx;
  line-height: 1.5;
}
.btn-publish {
  background-color: #FFFFFF;
  color: #059669;
  font-weight: bold;
  font-size: 26rpx;
  border-radius: 20rpx;
  margin-top: 24rpx;
  border: none;
}
.search-box {
  margin-bottom: 20rpx;
}
.search-input {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 18rpx 24rpx;
  font-size: 26rpx;
  border: 1rpx solid #E2E8F0;
}
.type-tabs {
  display: flex;
  background: #E2E8F0;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 24rpx;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  font-size: 26rpx;
  color: #64748B;
  border-radius: 16rpx;
}
.tab-item.active {
  background: #0F172A;
  color: #FFFFFF;
  font-weight: bold;
}
.trip-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.publisher-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}
.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #0F172A;
  display: block;
}
.user-phase {
  font-size: 22rpx;
  color: #64748B;
  display: block;
}
.time-badge {
  background: #ECFDF5;
  color: #059669;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-weight: bold;
  font-size: 24rpx;
}
.route-box {
  margin: 20rpx 0;
  padding: 16rpx;
  background: #F8FAFC;
  border-radius: 16rpx;
}
.route-point {
  display: flex;
  align-items: center;
  font-size: 26rpx;
}
.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}
.dot-green { background: #10B981; }
.dot-red { background: #EF4444; }
.route-line {
  width: 2rpx;
  height: 20rpx;
  background: #CBD5E1;
  margin-left: 6rpx;
  margin-top: 4rpx;
  margin-bottom: 4rpx;
}
.font-bold {
  font-weight: bold;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22rpx;
  color: #64748B;
  border-top: 1rpx solid #F1F5F9;
  padding-top: 16rpx;
}
.seat-badge {
  color: #059669;
  font-weight: bold;
  background: #F0FDF4;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.action-box {
  margin-top: 20rpx;
}
.btn-book {
  background: #059669;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: bold;
  border-radius: 18rpx;
  border: none;
}
</style>
