import { useEffect, useMemo, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
  MdCalendarViewMonth,
  MdClose,
  MdDirectionsBoat,
  MdEngineering,
  MdHome,
  MdLogout,
  MdMenu,
} from 'react-icons/md';

import authService from '../../Services/authService';

import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const username = useMemo(() => {
    const name = authService.getUsername() || 'Usuário';

    return formatName(name);
  }, []);

  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');

    if (savedState !== null) {
      try {
        setSidebarCollapsed(JSON.parse(savedState));
      } catch {
        setSidebarCollapsed(false);
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);

    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [sidebarCollapsed]);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;

      localStorage.setItem('sidebar-collapsed', JSON.stringify(next));

      return next;
    });
  }

  function toggleMobileMenu() {
    setMobileMenuOpen((current) => !current);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function logout() {
    authService.logout();

    navigate('/login', {
      replace: true,
    });
  }

  function formatName(name) {
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function getNavClass({ isActive }) {
    return isActive ? `${styles.menuLink} ${styles.active}` : styles.menuLink;
  }

  return (
    <>
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu} />
      )}

      <aside
        className={[
          styles.sidebar,
          sidebarCollapsed ? styles.collapsed : '',
          mobileMenuOpen ? styles.mobileOpen : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarHeader}>
            {!sidebarCollapsed && (
              <NavLink
                to="/"
                className={styles.logoLink}
                onClick={closeMobileMenu}
              >
                <img className={styles.logoImg} src="/logo.png" alt="Logo" />
              </NavLink>
            )}

            <button
              type="button"
              className={styles.toggleBtn}
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {sidebarCollapsed ? <MdMenu /> : <MdClose />}
            </button>
          </div>

          <nav className={styles.menu}>
            <NavLink
              to="/"
              end
              className={getNavClass}
              onClick={closeMobileMenu}
            >
              <MdHome />

              {!sidebarCollapsed && <span>Gestão de Produção</span>}
            </NavLink>

            <NavLink
              to="/dashboard-producao"
              className={getNavClass}
              onClick={closeMobileMenu}
            >
              <MdCalendarViewMonth />

              {!sidebarCollapsed && <span>Planejamento</span>}
            </NavLink>

            <NavLink
              to="/embarcacao-detalhe/embarcacao/1"
              className={getNavClass}
              onClick={closeMobileMenu}
            >
              <MdDirectionsBoat />

              {!sidebarCollapsed && <span>Embarcação Detalhe</span>}
            </NavLink>

            <NavLink
              to="/produtividade-operador"
              className={getNavClass}
              onClick={closeMobileMenu}
            >
              <MdEngineering />

              {!sidebarCollapsed && <span>Produtividade</span>}
            </NavLink>

            <div className={styles.menuDivider} />

            {!sidebarCollapsed && (
              <span className={styles.menuSectionTitle}>Outro Layout</span>
            )}

            <div className={styles.secondaryMenu}>
              <NavLink
                to="/gestao-copy"
                end
                className={getNavClass}
                onClick={closeMobileMenu}
              >
                <MdHome />

                {!sidebarCollapsed && <span>Gestão</span>}
              </NavLink>

              <NavLink
                to="/producao-copy"
                className={getNavClass}
                onClick={closeMobileMenu}
              >
                <MdCalendarViewMonth />

                {!sidebarCollapsed && <span>Planejamento</span>}
              </NavLink>

              <NavLink
                to="/produtividade-copy"
                className={getNavClass}
                onClick={closeMobileMenu}
              >
                <MdEngineering />

                {!sidebarCollapsed && <span>Produtividade</span>}
              </NavLink>
            </div>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{initial}</div>

            {!sidebarCollapsed && (
              <div>
                <strong>{username}</strong>
                <span>Gestor de Produção</span>
              </div>
            )}
          </div>

          <button
            className={styles.logoutBtn}
            type="button"
            onClick={logout}
            aria-label="Sair"
          >
            <MdLogout />
          </button>
        </div>
      </aside>

      <button
        className={styles.mobileMenuBtn}
        type="button"
        onClick={toggleMobileMenu}
        aria-label="Abrir menu"
      >
        <MdMenu />
      </button>
    </>
  );
}
