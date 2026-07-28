import { MdHourglassTop, MdRefresh, MdSync } from 'react-icons/md';

import styles from './PageLoading.module.css';

const iconMap = {
  hourglass_top: MdHourglassTop,
  refresh: MdRefresh,
  sync: MdSync,
};

export default function PageLoading({
  message = 'Carregando dados...',
  icon = 'hourglass_top',
  minHeight = '420px',
}) {
  const LoadingIcon = iconMap[icon] ?? MdHourglassTop;

  return (
    <div
      className={styles.pageLoading}
      style={{
        minHeight,
      }}
      role="status"
      aria-live="polite"
    >
      <div className={styles.loadingIcon}>
        <LoadingIcon />
      </div>

      <span>{message}</span>
    </div>
  );
}
