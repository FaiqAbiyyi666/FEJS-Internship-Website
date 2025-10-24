import { useLoading } from '../../contexts/LoadingContext';
import './GlobalLoader.css'; // Kita akan buat file CSS ini di bawah

export default function GlobalLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
}
