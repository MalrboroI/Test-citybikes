import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Typography,
  Spin,
  Empty,
  Button,
  Alert,
  Row,
  Col,
  Space,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ReloadOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNetworksStore } from "../../stores/useNetworksStore";
import { useStationsStore } from "../../stores/useStationsStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import InfiniteScroll from "react-infinite-scroll-component";
import "./StationsList.scss";

const { Text, Title } = Typography;

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
    error,
    selectedStation,
    toggleStationSelection,
    clearSelectedStation,
  } = useStationsStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const [displayedItems, setDisplayedItems] = useState(20);

  useEffect(() => {
    if (showOnlyFavorites) {
      setDisplayedItems(20);
    }
  }, [showOnlyFavorites]);

  const handleReset = () => {
    resetPagination();
    setDisplayedItems(20);
    clearSelectedStation();
  };

  const loadMoreData = () => {
    if (isLoading) return null;
    loadMoreStations();
    setDisplayedItems(prev => prev + 20);
  };

  const handleStationClick = (station: any) => {
    toggleStationSelection(station);
  };

  // Фильтруем станции если показываем только избранные
  const stationsToShow = showOnlyFavorites
    ? allStations
        .filter(station => favorites.includes(station.id))
        .slice(0, displayedItems)
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
        <div className="stations-panel__title-section">
          <Title level={4} className="stations-panel__title">
            {showOnlyFavorites
              ? "Избранные станции"
              : `Станции в ${selectedNetwork.location.city}`}
          </Title>
          {showOnlyFavorites && (
            <Text className="stations-panel__favorites-count">
              {stationsToShow.length} станций
            </Text>
          )}
        </div>

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

      {/* Информация о выбранной станции */}
      {selectedStation && (
                <div className="station-detail">
                  <Card className="station-detail__card">
                    <div className="station-detail__content">
                      <div className="station-detail__header">
                        <EnvironmentOutlined className="station-detail__icon" />
                        <Title level={5} className="station-detail__name">
                          {selectedStation.name}
                        </Title>
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={clearSelectedStation}
                          className="station-detail__close-btn"
                        />
                      </div>
                      
                      <div className="station-detail__info">
                        <div className="station-detail__stat">
                          <Text strong className="station-detail__stat-value">
                            {selectedStation.free_bikes}
                          </Text>
                          <Text type="secondary" className="station-detail__stat-label">
                            Доступно велосипедов
                          </Text>
                        </div>
                        
                        <div className="station-detail__stat">
                          <Text strong className="station-detail__stat-value">
                            {selectedStation.empty_slots}
                          </Text>
                          <Text type="secondary" className="station-detail__stat-label">
                            Свободных мест
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

      <div id="scrollableDiv" className="stations-panel__infinite-container">
        <InfiniteScroll
          dataLength={stationsToShow.length}
          next={loadMoreData}
          hasMore={hasMoreToLoad}
          loader={
            <div className="stations-panel__loading-bottom">
              <Spin size="small" />
              <Text type="secondary">Загрузка...</Text>
            </div>
          }
          endMessage={
            <div className="stations-panel__end">
              <Text type="secondary">
                {showOnlyFavorites ? "Все избранные станции загружены" : "Все станции загружены"}
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
                  className={`station-card ${
                    favorites.includes(station.id) ? "station-card__favorites" : ""
                  } ${selectedStation?.id === station.id ? "station-card__selected" : ""}`}
                  size="small"
                  onClick={() => handleStationClick(station)}
                >
                  <div className="station-card__content">
                    <div className="station-card__info">
                      <Text strong className="station-card__name">
                        {station.name}
                      </Text>
                      <Text className="station-card__details">
                        <span className="station-card__bike">Free bikes:</span>{station.free_bikes}
                        <span className="station-card__slot">Slots:</span>{station.empty_slots}
                      </Text>
                    </div>
                    <div
                      className="station-card__favorite"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(station.id);
                      }}
                    >
                      {favorites.includes(station.id) ? (
                        <HeartFilled className="station-card__favorite-icon station-card__favorite-icon__active" />
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