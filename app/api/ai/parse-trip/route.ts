import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: '请提供语音识别或输入的文字内容' }, { status: 400 });
    }

    const promptText = `
你是一个智能拼车行程订单解析助手。用户通过语音或打字输入了一段拼车需求。
请根据用户的文本，提取出结构化的拼车订单信息，并以纯 JSON 格式输出。

今天的基准日期是：${new Date().toISOString().split('T')[0]}（如果是明天/周一等，请换算为 YYYY-MM-DD）。

待解析的拼车内容：
"${text}"

请严格返回以下 JSON 对象（不要输出 markdown 代码块以外的多余文字）：
{
  "type": "driver_offer" 或 "passenger_request", // "driver_offer"表示车找人/车主发车，"passenger_request"表示人找车/乘客求拼
  "originName": "出发地具体位置（如：恒大文旅城1期星空门岗）",
  "destName": "目的地位置（如：高新软件新城·环普科技园）",
  "departureDate": "YYYY-MM-DD", // 如 2026-08-16
  "departureTime": "HH:mm", // 如 07:30 或 18:00
  "seats": 1, // 可提供座位数或乘车人数（数字，默认为 3 或 1）
  "price": 15, // 拼车分摊费用（数字元，如没有提到可默认 10~15 或 0）
  "carModel": "", // 车型（若提到，如比亚迪汉、特斯拉等）
  "plateMasked": "", // 车牌（若提到）
  "highwayRoute": "" // 途经路线（如走绕城高速、正阳大道等）
}
`;

    // 1. Try DeepSeek API if DEEPSEEK_API_KEY is configured
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: 'You are a helpful structured JSON extraction assistant. Return raw JSON only.' },
              { role: 'user', content: promptText },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          }),
        });

        if (deepseekRes.ok) {
          const dsData = await deepseekRes.json();
          const parsed = JSON.parse(dsData.choices[0].message.content);
          return NextResponse.json({ success: true, data: parsed, source: 'deepseek' });
        }
      } catch (dsErr) {
        console.warn('DeepSeek call failed, falling back to Gemini/Local NLP:', dsErr);
      }
    }

    // 2. Try Gemini API
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
        }
      } catch (geminiErr) {
        console.warn('Gemini call failed, falling back to heuristic parser:', geminiErr);
      }
    }

    // 3. Fallback Heuristic NLP parser (Zero API Key dependency)
    const lower = text.toLowerCase();
    const isPassenger = text.includes('人找车') || text.includes('求拼') || text.includes('找车') || text.includes('求带') || text.includes('需要车');
    
    // Extract Time
    let extractedTime = '07:30';
    const timeMatch = text.match(/([0-2]?[0-9])[:：点点整时]([0-5][0-9]|半)?/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      let min = '00';
      if (timeMatch[2] === '半') min = '30';
      else if (timeMatch[2]) min = timeMatch[2].padStart(2, '0');
      extractedTime = `${hour.toString().padStart(2, '0')}:${min}`;
    }

    // Extract Date
    const today = new Date();
    let targetDate = today.toISOString().split('T')[0];
    if (text.includes('明天') || text.includes('明早')) {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      targetDate = tomorrow.toISOString().split('T')[0];
    } else if (text.includes('后天')) {
      const afterTomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);
      targetDate = afterTomorrow.toISOString().split('T')[0];
    }

    // Extract Seats
    let extractedSeats = isPassenger ? 1 : 3;
    const seatMatch = text.match(/([1-4])\s*(个|位)?\s*(座|人|空位)/);
    if (seatMatch) {
      extractedSeats = parseInt(seatMatch[1], 10);
    }

    // Extract Price
    let extractedPrice = 15;
    const priceMatch = text.match(/([0-9]{1,3})\s*(元|块|每位|位)/);
    if (priceMatch) {
      extractedPrice = parseInt(priceMatch[1], 10);
    }

    // Extract Origin & Dest
    let originName = '恒大文旅城·1期星空门岗';
    let destName = '高新软件新城·环普科技园';

    if (text.includes('从') && text.includes('到')) {
      const fromTo = text.match(/从\s*([^，,到去至]+)\s*[到去至]\s*([^，,。\n]+)/);
      if (fromTo) {
        originName = fromTo[1].trim();
        destName = fromTo[2].trim();
      }
    } else if (text.includes('去')) {
      const toMatch = text.match(/去\s*([^，,。\n]+)/);
      if (toMatch) {
        destName = toMatch[1].trim();
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        type: isPassenger ? 'passenger_request' : 'driver_offer',
        originName,
        destName,
        departureDate: targetDate,
        departureTime: extractedTime,
        seats: extractedSeats,
        price: extractedPrice,
        carModel: text.includes('比亚迪') ? '比亚迪 汉' : text.includes('特斯拉') ? '特斯拉 Model Y' : '',
        plateMasked: '',
        highwayRoute: text.includes('高速') ? '走绕城高速ETC' : '正阳大道 ➔ 快速干道',
      },
      source: 'local_nlp',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || '解析失败' }, { status: 500 });
  }
}
