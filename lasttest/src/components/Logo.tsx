import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  to?: string;
}

export default function Logo({ className = 'h-10 w-10', to = '/' }: LogoProps) {
  return (
    <Link to={to} className="inline-flex items-center justify-center" aria-label="Rafna Investment home">
      <img src="/logo.svg" alt="Rafna Investment" className={className} />
    </Link>
  );
}
