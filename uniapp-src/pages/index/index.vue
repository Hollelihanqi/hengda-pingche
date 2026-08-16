<template>
  <!-- 恒大文旅城 拼车大厅 uni-app Vue3 -->
  <view class="container">
    <!-- 顶部宣传卡片 -->
    <view class="banner-card">
      <view class="banner-badge-row">
        <text class="banner-tag">🏰 文旅城拼车专线</text>
        <text class="free-badge">邻里顺路</text>
      </view>
      <view class="banner-title">早晚高峰 · 邻里拼车大厅</view>
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
          <view class="footer-right">
            <text class="price-badge" v-if="item.price">¥{{ item.price }}/位</text>
            <text class="seat-badge">余 {{ item.availableSeats }} 席</text>
          </view>
        </view>

        <!-- 预约操作 -->
        <view class="action-box" @click.stop>
          <button 
            class="btn-book" 
            :disabled="item.availableSeats <= 0"
            @click="bookTrip(item)"
          >
            {{ item.availableSeats > 0 ? '一键预约同行' : '已满员' }}
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

const defaultTrips: CarpoolTrip[] = [
  {
    id: 'trip_001',
    type: 'driver_offer',
    publisher: {
      id: 'usr_001',
      name: '张宇轩 (邻居)',
      phone: '18729391167',
      communityPhase: '恒大文旅城·1期',
      buildingUnit: '3号楼1单元',
      isVerifiedOwner: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      creditScore: 99,
      carModel: '特斯拉 Model Y (陕A·D***8)'
    },
    departureDate: '2026-08-16',
    departureTime: '07:30',
    origin: { name: '恒大文旅城·1期星空门岗', address: '1期东主入口' },
    destination: { name: '高新·软件新城 (环普科技园)', address: '天谷八路A座' },
    routeHighway: '正阳大道 ➔ 绕城高速 ➔ 丈八立交',
    availableSeats: 2,
    totalSeats: 3,
    price: 15,
    preferences: [],
    note: '',
    bookings: []
  },
  {
    id: 'trip_002',
    type: 'driver_offer',
    publisher: {
      id: 'usr_002',
      name: '陈思远 (邻居)',
      phone: '13600009912',
      communityPhase: '恒大文旅城·2期',
      buildingUnit: '5号楼2单元',
      isVerifiedOwner: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      creditScore: 98,
      carModel: '比亚迪 汉EV (陕A·F***3)'
    },
    departureDate: '2026-08-16',
    departureTime: '07:10',
    origin: { name: '恒大文旅城·2期童世界主门', address: '2期大门' },
    destination: { name: '地铁2号线·运动公园站 (D口)', address: '凤城十路' },
    routeHighway: '西铜快速干线 ➔ 未央立交',
    availableSeats: 3,
    totalSeats: 3,
    price: 10,
    preferences: [],
    note: '',
    bookings: []
  }
];

function loadTrips(): void {
  const data = uni.getStorageSync('hd_trips');
  if (data && data.length > 0) {
    trips.value = data;
  } else {
    trips.value = defaultTrips;
    uni.setStorageSync('hd_trips', defaultTrips);
  }
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
  if (trip.availableSeats <= 0) return;
  uni.showModal({
    title: '确认预约同行',
    content: `确定预约【${trip.departureTime} ${trip.origin.name} ➔ ${trip.destination.name}】吗？`,
    success: (res) => {
      if (res.confirm) {
        trip.availableSeats -= 1;
        uni.setStorageSync('hd_trips', trips.value);
        uni.showToast({ title: '预约成功！', icon: 'success' });
      }
    }
  });
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #F8FAFC;
  min-height: 100vh;
}
.banner-card {
  background: linear-gradient(135deg, #059669 0%, #0D9488 50%, #0F172A 100%);
  border-radius: 28rpx;
  padding: 32rpx;
  color: #FFFFFF;
  margin-bottom: 24rpx;
}
.banner-badge-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.banner-tag {
  background: rgba(255, 255, 255, 0.2);
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.free-badge {
  background: rgba(52, 211, 153, 0.3);
  color: #A7F3D0;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.banner-title {
  font-size: 36rpx;
  font-weight: 900;
  margin-bottom: 8rpx;
}
.banner-desc {
  font-size: 22rpx;
  opacity: 0.85;
  margin-bottom: 24rpx;
}
.btn-publish {
  background: #FFFFFF;
  color: #0F172A;
  font-weight: bold;
  font-size: 26rpx;
  border-radius: 20rpx;
  padding: 12rpx 0;
  border: none;
}
.search-box {
  margin-bottom: 20rpx;
}
.search-input {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  border: 1rpx solid #E2E8F0;
}
.type-tabs {
  display: flex;
  background: #E2E8F0;
  border-radius: 18rpx;
  padding: 6rpx;
  margin-bottom: 24rpx;
}
.tab-item {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  padding: 12rpx 0;
  color: #64748B;
  border-radius: 14rpx;
}
.tab-item.active {
  background: #FFFFFF;
  color: #0F172A;
  font-weight: bold;
}
.trip-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #E2E8F0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #F1F5F9;
}
.publisher-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.user-meta {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 24rpx;
  font-weight: bold;
  color: #0F172A;
}
.user-phase {
  font-size: 18rpx;
  color: #64748B;
}
.time-text {
  font-size: 26rpx;
  font-weight: bold;
  color: #0F172A;
}
.route-box {
  margin: 20rpx 0;
}
.route-point {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}
.dot-green { background: #10B981; }
.dot-red { background: #EF4444; }
.route-line {
  width: 2rpx;
  height: 20rpx;
  background: #CBD5E1;
  margin-left: 6rpx;
}
.point-name {
  font-size: 24rpx;
  color: #334155;
}
.font-bold { font-weight: bold; }
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20rpx;
  color: #64748B;
  padding-top: 12rpx;
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.price-badge {
  background: #FEF3C7;
  color: #B45309;
  font-weight: bold;
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
}
.seat-badge {
  color: #059669;
  font-weight: bold;
}
.action-box {
  margin-top: 16rpx;
}
.btn-book {
  background: #059669;
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: bold;
  border-radius: 16rpx;
  padding: 8rpx 0;
}
</style>
