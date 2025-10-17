import React, { useState } from 'react';
import '../styles/header.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  // ログイン処理やスコア更新のロジックをここに書きます
  const handleLogin = () => {
    // ログイン処理...
    setIsLoggedIn(true);
  };

  return (
    <header className="header">
      <nav className="header-links"> {/* リンクをまとめるコンテナを追加 */}
        <a href="/" style={{ marginRight: '32px', textDecoration: 'none', color: '#fff' }}>
          ホーム
        </a>
        <a href="/practice" style={{ marginRight: '32px', textDecoration: 'none', color: '#fff' }}>
          練習
        </a>
        <a href="/braille_table" style={{ textDecoration: 'none', color: '#fff' }}>
          指点字表
        </a>
      </nav>

      {/* <div>
        {isLoggedIn ? (
          <span>最高記録: {bestScore}</span>
        ) : (
          <button onClick={handleLogin}>ログイン</button>
        )}
      </div> */}
    </header>
  );
};

export default Header;