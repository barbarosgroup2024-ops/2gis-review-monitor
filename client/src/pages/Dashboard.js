import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies } from '../services/api';
import { getCurrentUser } from '../services/auth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, companiesData] = await Promise.all([
        getCurrentUser(),
        getCompanies()
      ]);
      
      setUser(userData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>Добро пожаловать, {user?.name}!</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего компаний</h3>
          <div className="value">{companies.length}</div>
        </div>
        <div className="stat-card">
          <h3>Активных</h3>
          <div className="value">{companies.filter(c => c.active).length}</div>
        </div>
        <div className="stat-card">
          <h3>Неактивных</h3>
          <div className="value">{companies.filter(c => !c.active).length}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Быстрый старт</h3>
        
        {companies.length === 0 ? (
          <div>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              У вас пока нет добавленных компаний. Начните с добавления вашей первой компании!
            </p>
            <Link to="/companies" className="btn btn-primary">
              Добавить компанию
            </Link>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Ваши компании настроены и работают. Система автоматически проверяет новые отзывы каждые 5 минут.
            </p>
            <Link to="/companies" className="btn btn-secondary">
              Управление компаниями
            </Link>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Как это работает?</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
          <li>Добавьте компанию и укажите ссылку на API 2GIS</li>
          <li>Настройте Telegram бота для получения уведомлений</li>
          <li>Система автоматически проверяет новые отзывы каждые 5 минут</li>
          <li>Получайте мгновенные уведомления о новых отзывах в Telegram</li>
          <li>Просматривайте статистику и историю отзывов в личном кабинете</li>
        </ol>
      </div>

      {companies.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Ваши компании</h3>
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <div className="company-name">{company.companyName}</div>
                <span className={`company-status ${company.active ? 'active' : 'inactive'}`}>
                  {company.active ? 'Активна' : 'Неактивна'}
                </span>
              </div>
              <Link to={`/companies/${company.id}`} className="btn btn-secondary">
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;