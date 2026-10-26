// 1. コアライブラリ

// 2. 型定義 (Type Imports)
import type { FC } from 'react';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import styles from './LoginButton.module.css';

// ログインボタン用のコンポーネント
const LoginButton: FC = () => {
  const handleLogin = () => {
    alert("ログイン機能を追加します");
  };

  return (
    <button
      className={styles.loginButton}
      onClick={handleLogin}
    >
      ログイン
    </button>
  );
};

export default LoginButton;