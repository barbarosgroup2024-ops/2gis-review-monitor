import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, deleteCompany } from '../services/api';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Вы уверены, что хотите удалить компанию "${name}"?`)) {
      return;
    }

    try {
      await deleteCompany(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (error) {
      alert('Ошибка при удалении компании');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Мои компании</h2>
        <Link to="/companies/new" className="btn btn-primary">
          + Добавить компанию
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#666' }}>У вас пока нет компаний</h3>
          <p style={{ marginBottom: '30px', color: '#999' }}>
            Добавьте вашу первую компанию, чтобы начать мониторинг отзывов
          </p>
          <Link to="/companies/new" className="btn btn-primary">
            Добавить компанию
          </Link>
        </div>
      ) : (
        <div>
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <div>
                  <div className="company-name">{company.companyName}</div>
                  <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
                    Создана: {new Date(company.created).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <span className={`company-status ${company.active ? 'active' : 'inactive'}`}>
                  {company.active ? 'Активна' : 'Неактивна'}
                </span>
              </div>

              <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                <div style={{ marginBottom: '5px' }}>
                  {company.telegramActivated ? (
                    <span style={{ color: '#28a745' }}>
                      ✅ Telegram бот активирован (@{company.telegramUsername || 'пользователь'})
                    </span>
                  ) : company.telegramActivationCode ? (
                    <span style={{ color: '#ffc107' }}>
                      ⏳ Ожидает активации (код: {company.telegramActivationCode})
                    </span>
                  ) : (
                    <span>📱 Telegram: {company.telegramChatId ? 'Настроен (старая система)' : 'Не настроен'}</span>
                  )}
                </div>
                <div>
                  🔗 API 2GIS: {company.twoGisApiUrl ? 'Подключен' : 'Не подключен'}
                </div>
              </div>

              <div className="company-actions">
                <Link to={`/companies/${company.id}`} className="btn btn-secondary">
                  Подробнее
                </Link>
                <button 
                  onClick={() => handleDelete(company.id, company.companyName)}
                  className="btn btn-danger"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;