import React from 'react';
import { List, Typography, Spin, Button } from 'antd';
import { useNetworksStore } from '../../stores/useNetworksStore';
import { useStationsStore } from '../../stores/useStationsStore';
import './NetworksList.scss';

const { Text } = Typography;

export const NetworksList: React.FC = () => {
  const { networks, selectedNetwork, isLoading, fetchNetworks, selectNetwork, setSelectedNetwork } = useNetworksStore();
  const { fetchStations, fetchVelobikeMoscowStations } = useStationsStore();

  React.useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  const handleNetworkSelect = async (networkId: string) => {
    selectNetwork(networkId);
    await fetchStations(networkId);
  };

  const handleVelobikeMoscowSelect = async () => {
    // Создаем объект сети для Velobike Moscow
    const velobikeNetwork = {
      id: 'velobike-moscow',
      name: 'Velobike',
      company: [{ name: 'SAO «СитиБайк»' }],
      location: {
        city: 'Moscow',
        country: 'RU',
        latitude: 55.7558,
        longitude: 37.6173
      }
    };
    
    setSelectedNetwork(velobikeNetwork);
    await fetchVelobikeMoscowStations();
  };

  if (isLoading) {
    return (
      <div className="networks-panel__loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="networks-panel">
      <h4 className="networks-panel__title">Сети велопроката</h4>
      
      {/* Кнопка для быстрого доступа к Velobike Moscow */}
      <div className="networks-panel__quick-access">
        <Button 
          type="primary" 
          size="small"
          onClick={handleVelobikeMoscowSelect}
          className="networks-panel__velobike-btn"
        >
          Velobike Moscow
        </Button>
      </div>

      <List
        className="networks-panel__list"
        dataSource={networks}
        renderItem={network => (
          <List.Item
            className={`networks-panel__item ${
              selectedNetwork?.id === network.id ? 'networks-panel__item--selected' : ''
            }`}
            onClick={() => handleNetworkSelect(network.id)}
          >
            <div className="networks-panel__item-content">
              <Text strong>{network.name}</Text>
              <Text type="secondary">
                {network.location.city}, {network.location.country}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};