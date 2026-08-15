<script setup lang="ts">
/**
 * 恒大文旅城邻里拼车 uni-app 根组件 (Vue3 + TypeScript + UnoCSS)
 */
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import type { CarpoolTrip } from './types/carpool';

onLaunch(() => {
  console.log('【恒大文旅城拼车 uni-app TS】小程序启动');
  initLocalStorage();
});

onShow(() => {
  console.log('小程序显示');
});

onHide(() => {
  console.log('小程序隐藏');
});

function initLocalStorage() {
  const existing = uni.getStorageSync('hd_trips');
  if (!existing || existing.length === 0) {
    const mockTrips: CarpoolTrip[] = [
      {
        id: 'trip-101',
        type: 'driver_offer',
        publisher: {
          id: 'user-002',
          name: '李女士',
          phone: '139****8821',
          communityPhase: '恒大文旅城·1期',
          buildingUnit: '12栋1单元1801',
          isVerifiedOwner: true,
          creditScore: 98,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        departureDate: '2026-08-16',
        departureTime: '07:30',
        origin: { name: '文旅城1期 星空门岗', address: '泾河新城泾河大道中段' },
        destination: { name: '软件新城 (环普科技园)', address: '高新区天谷八路' },
        routeHighway: '正阳大道 ➔ 绕城高速 (高新通道)',
        availableSeats: 3,
        totalSeats: 4,
        preferences: ['走高速ETC', '禁烟', '空调适中'],
        carModel: '特斯拉 Model Y · 珍珠白',
        carPlate: '陕A·D***8',
        note: '早高峰通勤，文旅城1期星空门岗准时发车，直达高新软件新城。0元邻里互助！',
        bookings: []
      },
      {
        id: 'trip-102',
        type: 'driver_offer',
        publisher: {
          id: 'user-003',
          name: '王工',
          phone: '186****3310',
          communityPhase: '恒大文旅城·3期',
          buildingUnit: '8栋2单元0902',
          isVerifiedOwner: true,
          creditScore: 99,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        departureDate: '2026-08-16',
        departureTime: '07:45',
        origin: { name: '文旅城3期 童梦汇南门', address: '乐华三路' },
        destination: { name: '地铁2号线 运动公园站D口', address: '未央路凤城十路' },
        routeHighway: '西铜快速干线 ➔ 朱宏路高架',
        availableSeats: 2,
        totalSeats: 4,
        preferences: ['免费搭乘', '后排宽敞', '可放电脑包'],
        carModel: '理想 L7 · 银灰',
        carPlate: '陕A·F***6',
        note: '经开区行政中心/运动公园地铁站接驳，准点发车。',
        bookings: []
      }
    ];
    uni.setStorageSync('hd_trips', mockTrips);
  }
}
</script>

<style>
/* uni-app 全局公共样式 */
page {
  background-color: #F7F8FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', sans-serif;
  color: #1E293B;
  box-sizing: border-box;
}

view, text, button, input {
  box-sizing: border-box;
}

.text-emerald {
  color: #059669;
}
.bg-emerald {
  background-color: #059669;
}
</style>
