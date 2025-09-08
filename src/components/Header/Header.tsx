import React from 'react';
import { Layout, Typography, Badge, Button } from 'antd';
import {HeartFilled, FilterFilled  } from '@ant-design/icons';
import { useNetworksStore } from '../../stores/useNetworksStore';
import { useStationsStore } from '../../stores/useStationsStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import './Header.scss';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

export const Header: React.FC = () => {
  const { selectedNetwork } = useNetworksStore();
  const { allStations, displayedStations, showOnlyFavorites, toggleShowFavorites } = useStationsStore();
  const { favorites } = useFavoritesStore();

  const handleFavoritesClick = () => {
    toggleShowFavorites();
  };

  return (
    <AntHeader className="app-header">
      <div className="app-header__content">
        <div className="app-header__left">
          <Title level={3} className="app-header__title">
            City Bikes
          </Title>
        </div>
          {selectedNetwork && (
            <div className="app-header__network-info">
              <Text className="app-header__network-name">
                Название сети: <span className='app-header__name'>
                  {selectedNetwork.name}</span>
              </Text>
              <Text className="app-header__stations-count">
                Колличество станций: <span className='app-header__length'>
                {displayedStations.length}/{allStations.length}</span>
              </Text>
            </div>
          )}
        
        <div className="app-header__right">
          <Badge count={favorites.length} size="small" className="app-header__badge">
            <Button
              type={showOnlyFavorites ? 'primary' : 'default'}
              icon={<HeartFilled className='app-header__icon'/>}
              size="middle"
              onClick={handleFavoritesClick}
              className="app-header__favorites-btn"
            >
              Likes: <span className='app-header__like'>{favorites.length}</span>
              {showOnlyFavorites && <FilterFilled className="app-header__filter-icon" />}
            </Button>
          </Badge>
        </div>
      </div>
    </AntHeader>
  );
};