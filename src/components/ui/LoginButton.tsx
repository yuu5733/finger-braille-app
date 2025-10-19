import React from 'react';

import type { FC } from 'react';

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