import { useLoading } from '../../contexts/LoadingContext';
import './GlobalLoader.css';

export default function GlobalLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
}
