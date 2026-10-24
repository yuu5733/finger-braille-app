import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  console.log('[API] リクエストURL全体:', url.toString());
  
  const sourceText = url.searchParams.get('text');
  console.log('[API] 取得したtextパラメータ:', sourceText);

  if (!sourceText) {
    console.log('[API] エラー: textパラメータが空または存在しません');
    return new Response(JSON.stringify({ error: 'テキストがありません' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const targetUrl = `https://neomomo-193894550340.asia-northeast1.run.app/predict?source=${encodeURIComponent(sourceText)}&model=large`;
    console.log('[API] 外部Momo APIへリクエスト送信:', targetUrl);
    
    const response = await fetch(targetUrl);
    const htmlText = await response.text();
    console.log('[API] 外部APIからHTML取得成功 (文字数:', htmlText.length, ')');

    const brailleMatch = htmlText.match(/([⠀-⠿]+(?:\s+[⠀-⠿]+)*)/);
    const brailleResult = brailleMatch ? brailleMatch[1].trim() : '';
    console.log('[API] 抽出された点字結果:', brailleResult);

    return new Response(
      JSON.stringify({
        success: true,
        source: sourceText,
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