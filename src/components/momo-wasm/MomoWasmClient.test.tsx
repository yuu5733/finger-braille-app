import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import WasmClient from './MomoWasmClient';
import * as momorsWasm from 'momors_wasm';
import { parseTextToBrailleCells } from '../../utils/wasmParser';

const mockFreePredictor = vi.fn();
const mockFreeTranslator = vi.fn();

vi.mock('momors_wasm', () => ({
  default: vi.fn(),
  Predictor: vi.fn().mockImplementation(() => ({
    free: mockFreePredictor,
  })),
  BrailleTranslator: vi.fn().mockImplementation(() => ({
    free: mockFreeTranslator,
  })),
}));

vi.mock('../../utils/wasmParser', () => ({
  parseTextToBrailleCells: vi.fn(),
}));

describe('MomoWasmClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(momorsWasm.default).mockResolvedValue(undefined as never);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      })
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test('WASM初期化後にテキスト変換を実行し、結果とアンマウント時のfreeを確認する', async () => {
    vi.mocked(parseTextToBrailleCells).mockReturnValue({
      kana: 'きょう',
      brailleCells: [{ character: 'き', brailleChar: '⠩', dots: [1, 2, 4, 6] }],
    } as never);

    const { unmount } = render(<WasmClient />);

    const convertBtn = screen.getByRole('button', {
      name: '変換',
    }) as HTMLButtonElement;
    expect(convertBtn.disabled).toBe(true);

    await waitFor(() => {
      expect(
        screen.getByText('ライブラリ「MOMO」の準備が完了しました')
      ).toBeDefined();
    });
    expect(convertBtn.disabled).toBe(false);

    const textarea = screen.getByLabelText(
      '変換するテキスト'
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Kyō' } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText('Kyō')).toBeDefined();
      expect(screen.getByText('きょう')).toBeDefined();
    });

    expect(parseTextToBrailleCells).toHaveBeenCalledWith(
      expect.any(Object),
      'kyō'
    );

    unmount();
    expect(mockFreePredictor).toHaveBeenCalledTimes(1);
    expect(mockFreeTranslator).toHaveBeenCalledTimes(1);
  });

  test('辞書データ取得に失敗した場合はエラーメッセージを表示する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })
    );

    render(<WasmClient />);

    await waitFor(() => {
      expect(screen.getByText(/WASMの初期化に失敗しました/)).toBeDefined();
    });
  });

  test('変換処理で例外が発生した場合は変換失敗メッセージを表示する', async () => {
    vi.mocked(parseTextToBrailleCells).mockImplementation(() => {
      throw new Error('パースエラー');
    });

    render(<WasmClient />);

    await waitFor(() => {
      expect(
        screen.getByText('ライブラリ「MOMO」の準備が完了しました')
      ).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: '変換' }));

    await waitFor(() => {
      expect(screen.getByText(/変換失敗: Error: パースエラー/)).toBeDefined();
    });
  });
});
