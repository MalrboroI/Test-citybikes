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
  const { showOnlyFavorites, filterStationsByFavorites } = useStationsStore();
  const { favorites } = useFavoritesStore();

  // Автоматически фильтруем станции при изменении избранного
  useEffect(() => {
    filterStationsByFavorites(favorites);
  }, [favorites, showOnlyFavorites, filterStationsByFavorites]);

  return (
    <ConfigProvider locale={ruRU}>
      <div className="app">
        <Layout className="app-layout">
          <Header />
          <Layout>
            <Sider width={440} className="app-sider">
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