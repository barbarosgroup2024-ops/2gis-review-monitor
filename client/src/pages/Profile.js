import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/auth';
import { getSubscription } from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, subscriptionData] = await Promise.all([
        getCurrentUser(),
        getSubscription()
      ]);
      
      setUser(userData);
      setName(userData.name);
      setSubscription(subscriptionData);
    } catch (error) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateProfile(name);
      setSuccess('Профиль обновлен!');
      setUser({ ...user, name });
    } catch (err) {
      setError('Ошибка при обновлении профиля');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  const getPlanName = (plan) => {
    const plans = {
      trial: 'Пробный период',
      basic: 'Базовый',
      premium: 'Премиум'
    };
    return plans[plan] || plan;
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#4CAF50' : '#f44336';
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>Профиль</h2>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Личные данные</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ background: '#f5f5f5' }}
            />
          </div>

          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>

      {subscription && (
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Подписка</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Тариф:</strong> {getPlanName(subscription.plan)}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Статус:</strong>{' '}
            <span style={{ color: getStatusColor(subscription.status) }}>
              {subscription.status === 'active' ? 'Активна' : 'Неактивна'}
            </span>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Начало:</strong> {new Date(subscription.startDate).toLocaleDateString('ru-RU')}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Окончание:</strong> {new Date(subscription.endDate).toLocaleDateString('ru-RU')}
          </div>

          {subscription.plan === 'trial' && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#FFF3E0', borderRadius: '5px' }}>
              <p style={{ margin: 0, color: '#F57C00' }}>
                ⚠️ У вас пробный период. После окончания необходимо будет оформить платную подписку.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Информация об аккаунте</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Дата регистрации:</strong> {new Date(user.created).toLocaleDateString('ru-RU')}
        </div>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
      </div>
    </div>
  );
}

export default Profile;