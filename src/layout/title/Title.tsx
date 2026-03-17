import './Title.css';

interface TitleProps {
  paragraph?: string;
  title: string;
  subtitle?: string;
}

const Title = ({ paragraph, title, subtitle }: TitleProps) => {
  return (
    <section className="title-section">
      <p className="title-section-paragraph">{paragraph}</p>
      <h2 className="api-page-title">{title}</h2>
      <p className="api-page-subtitle">{subtitle}</p>
    </section>
  );
};

export default Title;
