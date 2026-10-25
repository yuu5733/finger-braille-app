// @ts-check
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const sourceText = url.searchParams.get('text');

  if (!sourceText) {
    return new Response(JSON.stringify({ error: 'テキストがありません' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const targetUrl = `https://neomomo-193894550340.asia-northeast1.run.app/predict?source=${encodeURIComponent(sourceText)}&model=large`;
    const response = await fetch(targetUrl);
    const htmlText = await response.text();

    // 原文、仮名、点字をそれぞれ正規表現で抽出
    const originalMatch = htmlText.match(/<p>原文:\s*(.*?)<\/p>/);
    const kanaMatch = htmlText.match(/<p>仮名:\s*(.*?)<\/p>/);
    const brailleMatch = htmlText.match(/([⠀-⠿]+(?:\s+[⠀-⠿]+)*)/);

    const originalResult = originalMatch ? originalMatch[1].trim() : '';
    const kanaResult = kanaMatch ? kanaMatch[1].trim() : '';
    const brailleResult = brailleMatch ? brailleMatch[1].trim() : '';

    return new Response(
      JSON.stringify({
        success: true,
        original: originalResult,
        kana: kanaResult,
        result: brailleResult,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[API] 内部エラー発生:', error);
    return new Response(JSON.stringify({ error: 'API通信またはパース処理に失敗しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};