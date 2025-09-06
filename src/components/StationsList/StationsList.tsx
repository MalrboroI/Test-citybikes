import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, Empty, Button, Alert } from 'antd';
import { HeartOutlined, HeartFilled, ReloadOutlined } from '@ant-design/icons';
import { useNetworksStore } from '../../stores/useNetworksStore';
import { useStationsStore } from '../../stores/useStationsStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import './StationsList.scss';
import { useFavoritesStore } from '../../stores/useFavoritesStore';

const { Text } = Typography;

export const StationsList: React.FC = () => {
  const { selectedNetwork } = useNetworksStore();
  const { 
    allStations,
    displayedStations, 
    isLoading, 
    showOnlyFavorites, 
    hasMore,
    loadMoreStations,
    resetPagination,
    error
  } = useStationsStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const [displayedItems, setDisplayedItems] = useState<number>(50);

  useEffect(() => {
    if (showOnlyFavorites) {
      // При переключении на избранное сбрасываем счетчик
      setDisplayedItems(50);
    }
  }, [showOnlyFavorites]);

  const handleReset = () => {
    resetPagination();
    setDisplayedItems(50);
  };

  const loadMoreData = () => {
    if (isLoading) {
      return;
    }
    loadMoreStations();
    setDisplayedItems(prev => prev + 50);
  };

  // Фильтруем станции если показываем только избранные
  const stationsToShow = showOnlyFavorites 
    ? allStations.filter(station => favorites.includes(station.id)).slice(0, displayedItems)
    : displayedStations;

  const hasMoreToLoad = showOnlyFavorites 
    ? displayedItems < allStations.filter(station => favorites.includes(station.id)).length
    : hasMore;

  if (isLoading && stationsToShow.length === 0) {
    return (
      <div className="stations-panel__loading">
        <Spin size="large" />
        <Text type="secondary" className="stations-panel__loading-text">
          Загрузка станций...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stations-panel__error">
        <Alert
          message="Ошибка загрузки"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!selectedNetwork) {
    return (
      <div className="stations-panel__empty">
        <Empty 
          description="Выберите сеть велопроката для просмотра станций"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  if (showOnlyFavorites && stationsToShow.length === 0) {
    return (
      <div className="stations-panel__empty">
        <Empty 
          description="Нет избранных станций"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="stations-panel">
      <div className="stations-panel__header">
        <h4 className="stations-panel__title">
          {showOnlyFavorites ? 'Избранные станции' : `Станции в ${selectedNetwork.location.city}`}
          {showOnlyFavorites && (
            <span className="stations-panel__favorites-count">
              ({stationsToShow.length})
            </span>
          )}
        </h4>
        
        {showOnlyFavorites && (
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={handleReset}
            className="stations-panel__reset-btn"
          >
            Показать все
          </Button>
        )}
      </div>

      <div
        id="scrollableDiv"
        className="stations-panel__infinite-container"
      >
        <InfiniteScroll
          dataLength={stationsToShow.length}
          next={loadMoreData}
          hasMore={hasMoreToLoad}
          loader={
            <div className="stations-panel__loading-bottom">
              <Spin size="small" />
              <Text type="secondary" className="stations-panel__loading-text">
                Загрузка...
              </Text>
            </div>
          }
          endMessage={
            <div className="stations-panel__end">
              <Text type="secondary" className="stations-panel__end-text">
                {showOnlyFavorites ? 'Все избранные станции загружены' : 'Все станции загружены'}
              </Text>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <List
            className="stations-panel__list"
            dataSource={stationsToShow}
            renderItem={station => (
              <List.Item className="stations-panel__item">
                <Card 
                  className={`station-card ${favorites.includes(station.id) ? 'station-card--favorite' : ''}`}
                  size="small"
                >
                  <div className="station-card__content">
                    <div className="station-card__info">
                      <Text strong className="station-card__name">
                        {station.name}
                      </Text>
                      <div className="station-card__details">
                        <span className="station-card__bikes">
                          🚴 {station.free_bikes}
                        </span>
                        <span className="station-card__slots">
                          🅿️ {station.empty_slots}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="station-card__favorite"
                      onClick={() => toggleFavorite(station.id)}
                    >
                      {favorites.includes(station.id) ? (
                        <HeartFilled className="station-card__favorite-icon station-card__favorite-icon--active" />
                      ) : (
                        <HeartOutlined className="station-card__favorite-icon" />
                      )}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};