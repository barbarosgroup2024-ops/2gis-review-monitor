import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCompany, 
  updateCompany, 
  createCompany, 
  testConnection,
  getReviews,
  getStats,
  refreshReviews
} from '../services/api';

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [company, setCompany] = useState({
    companyName: '',
    twoGisApiUrl: '',
    twoGisProfileUrl: '',
    telegramBotToken: '',
    telegramChatId: '',
    checkIntervalMinutes: 5,
    minRatingFilter: null,
    maxRatingFilter: null,
    active: true
  });
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadCompanyData();
    }
  }, [id, isNew]);

  useEffect(() => {
    if (!isNew) {
      loadReviews();
    }
  }, [period, isNew]);

  const loadCompanyData = async () => {
    try {
      const [companyData, statsData] = await Promise.all([
        getCompany(id),
        getStats(id)
      ]);
      
      setCompany(companyData);
      setStats(statsData);
    } catch (error) {
      setError('Ошибка при загрузке данных компании');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await getReviews(id, period);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (isNew) {
        const newCompany = await createCompany(company);
        setSuccess('Компания успешно создана!');
        setTimeout(() => navigate(`/companies/${newCompany.id}`), 1500);
      } else {
        await updateCompany(id, company);
        setSuccess('Изменения сохранены!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setError('');
    setSuccess('');

    try {
      const result = await testConnection(id);
      if (result.success) {
        setSuccess(`✅ Подключение успешно! Найдено отзывов: ${result.reviewsCount}`);
      } else {
        setError(`❌ ${result.error}`);
      }
    } catch (err) {
      setError('Ошибка при тестировании подключения');
    }
  };

  const handleRefresh = async () => {
    try {
      const result = await refreshReviews(id);
      setSuccess(`Обновлено! Новых отзывов: ${result.newReviews}`);
      loadReviews();
      loadCompanyData();
    } catch (error) {
      setError('Ошибка при обновлении отзывов');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>
        {isNew ? 'Добавить компанию' : company.companyName}
      </h2>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Настройки компании</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название компании *</label>
            <input
              type="text"
              value={company.companyName}
              onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>URL API 2GIS *</label>
            <input
              type="url"
              value={company.twoGisApiUrl}
              onChange={(e) => setCompany({ ...company, twoGisApiUrl: e.target.value })}
              required
              disabled={saving}
              placeholder="https://public-api.reviews.2gis.com/3.0/orgs/..."
            />
            <small style={{ color: '#999' }}>
              Получите ссылку на API из панели 2GIS
            </small>
          </div>

          {/* Секция единого Telegram бота */}
          {!isNew && company.telegramActivationCode && (
            <div style={{ 
              background: company.telegramActivated ? '#d4edda' : '#fff3cd', 
              border: `1px solid ${company.telegramActivated ? '#c3e6cb' : '#ffeaa7'}`,
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginBottom: '15px', color: company.telegramActivated ? '#155724' : '#856404' }}>
                {company.telegramActivated ? '✅ Telegram бот активирован' : '📱 Активация Telegram бота'}
              </h4>
              
              {company.telegramActivated ? (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    <strong>Пользователь:</strong> @{company.telegramUsername || 'неизвестно'}
                  </p>
                  <p style={{ marginBottom: '10px' }}>
                    <strong>Активирован:</strong> {new Date(company.telegramActivatedAt).toLocaleString('ru-RU')}
                  </p>
                  <p style={{ marginBottom: '10px' }}>
                    <strong>Уведомления:</strong> {company.telegramNotificationsEnabled ? '✅ Включены' : '⏸ Приостановлены'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
                    💡 Управляйте ботом через Telegram: <a href="https://t.me/videokgdas_bot" target="_blank" rel="noopener noreferrer">@videokgdas_bot</a>
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    Для активации бота откройте Telegram и отправьте команду:
                  </p>
                  <div style={{ 
                    background: '#fff', 
                    padding: '15px', 
                    borderRadius: '5px',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    marginBottom: '15px',
                    border: '1px solid #ddd'
                  }}>
                    /start {company.telegramActivationCode}
                  </div>
                  <a 
                    href={`https://t.me/videokgdas_bot?start=${company.telegramActivationCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-block' }}
                  >
                    🚀 Открыть бота и активировать
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Настройки проверки отзывов */}
          {!isNew && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px' }}>⚙️ Настройки проверки отзывов</h4>
              
              <div className="form-group">
                <label>Интервал проверки (минуты)</label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={company.checkIntervalMinutes || 5}
                  onChange={(e) => setCompany({ ...company, checkIntervalMinutes: parseInt(e.target.value) })}
                  disabled={saving}
                />
                <small style={{ color: '#999' }}>
                  Как часто проверять новые отзывы (по умолчанию: 5 минут)
                </small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Минимальный рейтинг</label>
                  <select
                    value={company.minRatingFilter || ''}
                    onChange={(e) => setCompany({ ...company, minRatingFilter: e.target.value ? parseInt(e.target.value) : null })}
                    disabled={saving}
                  >
                    <option value="">Все отзывы</option>
                    <option value="1">⭐ 1 звезда</option>
                    <option value="2">⭐⭐ 2 звезды</option>
                    <option value="3">⭐⭐⭐ 3 звезды</option>
                    <option value="4">⭐⭐⭐⭐ 4 звезды</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 звезд</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Максимальный рейтинг</label>
                  <select
                    value={company.maxRatingFilter || ''}
                    onChange={(e) => setCompany({ ...company, maxRatingFilter: e.target.value ? parseInt(e.target.value) : null })}
                    disabled={saving}
                  >
                    <option value="">Все отзывы</option>
                    <option value="1">⭐ 1 звезда</option>
                    <option value="2">⭐⭐ 2 звезды</option>
                    <option value="3">⭐⭐⭐ 3 звезды</option>
                    <option value="4">⭐⭐⭐⭐ 4 звезды</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 звезд</option>
                  </select>
                </div>
              </div>

              <small style={{ color: '#999', display: 'block', marginTop: '10px' }}>
                💡 Например: мин=1, макс=2 → только плохие отзывы (1-2 звезды)
              </small>
            </div>
          )}

          {/* Старая система (для обратной совместимости) */}
          <details style={{ marginBottom: '20px' }}>
            <summary style={{ cursor: 'pointer', color: '#666', marginBottom: '10px' }}>
              📋 Старая система (индивидуальные боты)
            </summary>
            
            <div className="form-group">
              <label>Telegram Bot Token</label>
              <input
                type="text"
                value={company.telegramBotToken || ''}
                onChange={(e) => setCompany({ ...company, telegramBotToken: e.target.value })}
                disabled={saving}
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              />
              <small style={{ color: '#999' }}>
                Получите токен у @BotFather в Telegram
              </small>
            </div>

            <div className="form-group">
              <label>Telegram Chat ID</label>
              <input
                type="text"
                value={company.telegramChatId || ''}
                onChange={(e) => setCompany({ ...company, telegramChatId: e.target.value })}
                disabled={saving}
                placeholder="123456789"
              />
              <small style={{ color: '#999' }}>
                Получите свой Chat ID у @userinfobot
              </small>
            </div>
          </details>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={company.active}
                onChange={(e) => setCompany({ ...company, active: e.target.checked })}
                disabled={saving}
                style={{ marginRight: '10px' }}
              />
              Активна (проверять отзывы автоматически)
            </label>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            
            {!isNew && (
              <button 
                type="button" 
                onClick={handleTestConnection}
                className="btn btn-secondary"
              >
                Тестировать подключение
              </button>
            )}
            
            <button 
              type="button" 
              onClick={() => navigate('/companies')}
              className="btn"
              style={{ background: '#999', color: 'white' }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>

      {!isNew && stats && (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Статистика отзывов</h3>
              <button onClick={handleRefresh} className="btn btn-secondary">
                🔄 Обновить
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Всего</h3>
                <div className="value">{stats.total}</div>
              </div>
              <div className="stat-card">
                <h3>Сегодня</h3>
                <div className="value">{stats.today}</div>
              </div>
              <div className="stat-card">
                <h3>Вчера</h3>
                <div className="value">{stats.yesterday}</div>
              </div>
              <div className="stat-card">
                <h3>За неделю</h3>
                <div className="value">{stats.week}</div>
              </div>
              <div className="stat-card">
                <h3>За месяц</h3>
                <div className="value">{stats.month}</div>
              </div>
              <div className="stat-card">
                <h3>Средний рейтинг</h3>
                <div className="value">{stats.avgRating}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Отзывы</h3>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value="today">Сегодня</option>
                <option value="yesterday">Вчера</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="all">Все</option>
              </select>
            </div>

            {reviews.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                Нет отзывов за выбранный период
              </p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-user">{review.userName}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  {review.address && (
                    <div style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
                      📍 {review.address}
                    </div>
                  )}
                  <div className="review-text">{review.text}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CompanyDetails;