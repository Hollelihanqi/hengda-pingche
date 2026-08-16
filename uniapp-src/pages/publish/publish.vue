<template>
  <!-- 恒大文旅城 发布拼车 uni-app Vue3 -->
  <view class="container">
    <!-- AI 语音/一句话智能生成订单 (DeepSeek驱动) -->
    <view class="ai-box">
      <view class="ai-header">
        <text class="ai-title">✨ AI 语音/一句话生成订单 (DeepSeek)</text>
        <text class="ai-tag">智能识别</text>
      </view>
      <view class="ai-input-row">
        <input 
          class="ai-input" 
          v-model="aiText" 
          placeholder="按语音或输入：如“明早7点半从文旅城1期去高新软件新城，车找人3个座，车费15元”" 
        />
        <button class="ai-btn" :loading="isAiParsing" @click="handleAiParse">识别</button>
      </view>
    </view>

    <!-- 模式选择 -->
    <view class="type-switch">
      <view 
        class="type-btn" 
        :class="{ active: formData.type === 'driver_offer' }" 
        @click="formData.type = 'driver_offer'"
      >
        🚗 我是车主 · 发布空位
      </view>
      <view 
        class="type-btn" 
        :class="{ active: formData.type === 'passenger_request' }" 
        @click="formData.type = 'passenger_request'"
      >
        🙋 我是乘客 · 发布需求
      </view>
    </view>

    <!-- 表单主体 -->
    <view class="form-card">
      <view class="form-item">
        <text class="label">出发地点 (自由多行输入)</text>
        <textarea class="textarea" v-model="formData.origin" placeholder="如：恒大文旅城2期 星空门岗 (保安亭旁集合)" />
      </view>

      <view class="form-item">
        <text class="label">到达目的地 (自由多行输入)</text>
        <textarea class="textarea" v-model="formData.destination" placeholder="如：高新区 软件新城·环普科技园 / 运动公园地铁" />
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
          <view class="picker-val font-mono">{{ formData.departureTime }}</view>
        </picker>
      </view>

      <view class="form-item flex-between">
        <text class="label">{{ formData.type === 'driver_offer' ? '提供空余座位' : '求拼人数' }}</text>
        <picker mode="selector" :range="[1, 2, 3, 4]" :value="formData.seats - 1" @change="onSeatsChange">
          <view class="picker-val">{{ formData.seats }} 个</view>
        </picker>
      </view>

      <view class="form-item flex-between">
        <text class="label">分摊车费/补贴 (元/位，选填)</text>
        <input class="input-price" type="number" v-model="formData.price" placeholder="如：15" />
      </view>

      <view class="form-item" v-if="formData.type === 'driver_offer'">
        <text class="label">车辆信息 (选填)</text>
        <input class="input" v-model="formData.carModel" placeholder="如：比亚迪 汉 (陕A·D***8)" />
      </view>
    </view>

    <button class="btn-submit" @click="handleSubmit">立即发布拼车行程</button>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { CarpoolTrip } from '@/types/carpool';

interface FormDataState {
  type: 'driver_offer' | 'passenger_request';
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  seats: number;
  price: number;
  carModel: string;
}

const aiText = ref('');
const isAiParsing = ref(false);

const formData = reactive<FormDataState>({
  type: 'driver_offer',
  origin: '恒大文旅城 2期 星空门岗 (保安亭处)',
  destination: '高新区 软件新城 (环普科技园A座)',
  departureDate: '2026-08-16',
  departureTime: '07:30',
  seats: 3,
  price: 15,
  carModel: '比亚迪 汉 (陕A·D***8)',
});

const handleAiParse = async () => {
  if (!aiText.value.trim()) return;
  isAiParsing.value = true;
  try {
    const res = await uni.request({
      url: '/api/ai/parse-trip',
      method: 'POST',
      data: { text: aiText.value },
    });
    const d = (res.data as any)?.data;
    if (d) {
      if (d.type) formData.type = d.type;
      if (d.originName) formData.origin = d.originName;
      if (d.destName) formData.destination = d.destName;
      if (d.departureDate) formData.departureDate = d.departureDate;
      if (d.departureTime) formData.departureTime = d.departureTime;
      if (d.seats) formData.seats = d.seats;
      if (d.price) formData.price = d.price;
      if (d.carModel) formData.carModel = d.carModel;
      uni.showToast({ title: 'AI 识别成功并填充', icon: 'success' });
    }
  } catch (e) {
    uni.showToast({ title: 'AI 识别已就绪', icon: 'none' });
  } finally {
    isAiParsing.value = false;
  }
};

const onDateChange = (e: any) => {
  formData.departureDate = e.detail.value;
};

const onTimeChange = (e: any) => {
  formData.departureTime = e.detail.value;
};

const onSeatsChange = (e: any) => {
  formData.seats = Number(e.detail.value) + 1;
};

const handleSubmit = () => {
  if (!formData.origin || !formData.destination) {
    uni.showToast({ title: '请填写出发地与目的地', icon: 'none' });
    return;
  }

  const newTrip: CarpoolTrip = {
    id: 'trip_' + Date.now(),
    type: formData.type,
    publisher: {
      id: 'usr_me',
      name: '林远 (邻居)',
      phone: '18729391167',
      communityPhase: '恒大文旅城·2期',
      buildingUnit: '7号楼2单元',
      isVerifiedOwner: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      creditScore: 100,
      carModel: formData.carModel,
    },
    departureDate: formData.departureDate,
    departureTime: formData.departureTime,
    origin: { name: formData.origin, address: formData.origin },
    destination: { name: formData.destination, address: formData.destination },
    routeHighway: '正阳大道 ➔ 绕城高速',
    availableSeats: formData.seats,
    totalSeats: formData.seats,
    price: formData.price,
    preferences: [],
    note: '',
    bookings: [],
  };

  const stored = uni.getStorageSync('hd_carpool_trips') || [];
  stored.unshift(newTrip);
  uni.setStorageSync('hd_carpool_trips', stored);

  uni.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' });
  }, 1000);
};
</script>

<style scoped>
.container {
  padding: 24rpx;
  background-color: #f6f8fa;
  min-height: 100vh;
}
.ai-box {
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
  border: 2rpx solid #a7f3d0;
  border-radius: 24rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}
.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.ai-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #065f46;
}
.ai-tag {
  font-size: 20rpx;
  background-color: #d1fae5;
  color: #047857;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}
.ai-input-row {
  display: flex;
  gap: 12rpx;
}
.ai-input {
  flex: 1;
  background-color: #ffffff;
  border: 1rpx solid #6ee7b7;
  border-radius: 16rpx;
  padding: 12rpx 16rpx;
  font-size: 22rpx;
}
.ai-btn {
  background-color: #059669;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: bold;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 64rpx;
  line-height: 64rpx;
}
.type-switch {
  display: flex;
  background-color: #e2e8f0;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 24rpx;
}
.type-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 24rpx;
  color: #64748b;
  border-radius: 16rpx;
  font-weight: bold;
}
.type-btn.active {
  background-color: #ffffff;
  color: #0f172a;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.form-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #e2e8f0;
  margin-bottom: 24rpx;
}
.form-item {
  margin-bottom: 24rpx;
}
.form-item.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f1f5f9;
}
.label {
  font-size: 24rpx;
  color: #334155;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}
.textarea {
  width: 100%;
  height: 120rpx;
  background-color: #f8fafc;
  border: 1rpx solid #e2e8f0;
  border-radius: 16rpx;
  padding: 16rpx;
  font-size: 24rpx;
  box-sizing: border-box;
}
.input, .input-price {
  width: 100%;
  background-color: #f8fafc;
  border: 1rpx solid #e2e8f0;
  border-radius: 16rpx;
  padding: 16rpx;
  font-size: 24rpx;
  box-sizing: border-box;
}
.input-price {
  width: 200rpx;
  text-align: right;
  font-weight: bold;
}
.picker-val {
  font-size: 26rpx;
  font-weight: bold;
  color: #0f172a;
}
.btn-submit {
  background-color: #0f172a;
  color: #ffffff;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: bold;
  height: 88rpx;
  line-height: 88rpx;
  margin-top: 24rpx;
}
</style>
