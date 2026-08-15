<template>
  <!-- 恒大文旅城 我的行程与核验码 uni-app Vue3 -->
  <view class="container">
    <!-- 头部 Tab 切换 -->
    <view class="tab-header">
      <view 
        class="tab-btn" 
        :class="{ active: activeTab === 'bookings' }" 
        @click="activeTab = 'bookings'"
      >
        我的预约行程 ({{ bookings.length }})
      </view>
      <view 
        class="tab-btn" 
        :class="{ active: activeTab === 'published' }" 
        @click="activeTab = 'published'"
      >
        我发布的车次 ({{ myPublished.length }})
      </view>
    </view>

    <!-- 预约乘车列表 -->
    <view v-if="activeTab === 'bookings'">
      <view v-if="bookings.length === 0" class="empty-box">
        <text class="empty-text">暂无已预约的拼车行程</text>
      </view>

      <view v-for="item in bookings" :key="item.id" class="booking-card">
        <view class="card-header">
          <text class="time-tag">⏰ {{ item.tripTime }} 出发</text>
          <text class="status-tag">预约成功 · 待出行</text>
        </view>

        <view class="route-info">
          <view class="point">🟢 {{ item.origin }}</view>
          <view class="point font-bold">🔴 {{ item.destination }}</view>
        </view>

        <!-- 6位电子核验凭证码 -->
        <view class="code-box">
          <text class="code-title">乘车安全核验码 (上车出示给车主)</text>
          <text class="code-number">{{ item.boardingCode }}</text>
        </view>

        <view class="btn-cancel-box">
          <button class="btn-cancel" @click="cancelBooking(item.id)">取消预约</button>
        </view>
      </view>
    </view>

    <!-- 我发布的行程 -->
    <view v-if="activeTab === 'published'">
      <view v-if="myPublished.length === 0" class="empty-box">
        <text class="empty-text">您尚未发布拼车车次</text>
      </view>

      <view v-for="item in myPublished" :key="item.id" class="booking-card">
        <view class="card-header">
          <text class="time-tag">⏰ {{ item.departureTime }} 出发</text>
          <text class="status-tag">发布中 · 余{{ item.availableSeats }}座</text>
        </view>
        <view class="route-info">
          <view class="point">🟢 {{ item.origin.name }}</view>
          <view class="point font-bold">🔴 {{ item.destination.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import type { BookingRecord, CarpoolTrip } from '@/types/carpool';

const activeTab = ref<'bookings' | 'published'>('bookings');
const bookings = ref<BookingRecord[]>([]);
const myPublished = ref<CarpoolTrip[]>([]);

function loadData(): void {
  const bList: BookingRecord[] = uni.getStorageSync('hd_my_bookings') || [];
  const trips: CarpoolTrip[] = uni.getStorageSync('hd_trips') || [];
  
  bookings.value = bList;
  myPublished.value = trips.filter(t => t.publisher.id === 'user-me');
}

onShow(() => {
  loadData();
});

onPullDownRefresh(() => {
  loadData();
  uni.stopPullDownRefresh();
});

function cancelBooking(id: string): void {
  uni.showModal({
    title: '取消预约',
    content: '确定要取消本次拼车预约吗？',
    confirmColor: '#DC2626',
    success: (res) => {
      if (res.confirm) {
        const updated = bookings.value.filter(b => b.id !== id);
        uni.setStorageSync('hd_my_bookings', updated);
        bookings.value = updated;
        uni.showToast({ title: '已取消预约', icon: 'none' });
      }
    }
  });
}
</script>

<style scoped>
.container {
  padding: 24rpx;
}
.tab-header {
  display: flex;
  background: #E2E8F0;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 24rpx;
}
.tab-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  color: #64748B;
  border-radius: 16rpx;
}
.tab-btn.active {
  background: #FFFFFF;
  color: #059669;
  font-weight: bold;
}
.booking-card {
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
.time-tag {
  font-size: 26rpx;
  font-weight: bold;
  color: #0F172A;
}
.status-tag {
  font-size: 22rpx;
  color: #059669;
  background: #ECFDF5;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-weight: bold;
}
.route-info {
  margin: 20rpx 0;
  font-size: 26rpx;
  line-height: 1.8;
}
.font-bold {
  font-weight: bold;
}
.code-box {
  background: #F8FAFC;
  border: 2rpx dashed #059669;
  border-radius: 16rpx;
  padding: 20rpx;
  text-align: center;
  margin: 20rpx 0;
}
.code-title {
  font-size: 22rpx;
  color: #64748B;
  display: block;
}
.code-number {
  font-size: 48rpx;
  font-weight: 900;
  color: #059669;
  letter-spacing: 8rpx;
  margin-top: 8rpx;
  display: block;
}
.btn-cancel {
  background: #F1F5F9;
  color: #64748B;
  font-size: 24rpx;
  border-radius: 16rpx;
  border: none;
}
.empty-box {
  text-align: center;
  padding: 80rpx 0;
}
.empty-text {
  font-size: 26rpx;
  color: #94A3B8;
}
</style>
