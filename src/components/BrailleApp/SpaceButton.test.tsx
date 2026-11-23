import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import SpaceButton from './SpaceButton';

describe('SpaceButton', () => {
  test('ラベル・aria-pressed・maxWidth が反映される', () => {
    render(<SpaceButton isPressed={true} label="区切り" maxWidth="200px" />);

    const button = screen.getByRole('button', { name: '区切り' });
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.style.maxWidth).toBe('200px');
  });

  test('押下と解放で onPress / onRelease が呼ばれる', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    render(
      <SpaceButton isPressed={false} onPress={onPress} onRelease={onRelease} />
    );

    const button = screen.getByRole('button', { name: 'スペース' });

    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    fireEvent.touchStart(button);
    fireEvent.touchEnd(button);

    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onRelease).toHaveBeenCalledTimes(2);
  });
});
