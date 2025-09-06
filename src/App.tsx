import React, { useEffect } from 'react';
import { Layout, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { Header } from './components/Header/Header';
import { NetworksList } from './components/NetworksList/NetworksList';
import { StationsList } from './components/StationsList/StationsList';
import { useStationsStore } from './stores/useStationsStore';
import { useFavoritesStore } from './stores/useFavoritesStore';
import './App.scss';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const { showOnlyFavorites, filterStations } = useStationsStore();
  const { favorites } = useFavoritesStore();

  // Автоматически фильтруем станции при изменении избранного или режима показа
  useEffect(() => {
    filterStations(favorites);
  }, [favorites, showOnlyFavorites, filterStations]);

  return (
    <ConfigProvider locale={ruRU}>
      <div className="app">
        <Layout className="app-layout">
          <Header />
          <Layout>
            <Sider width={280} className="app-sider">
              <NetworksList />
            </Sider>
            <Content className="app-content">
              <StationsList />
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
