import './Footer.css';

const Footer = ({ name }: { name: string }) => {
  const formattedDate = new Date().toLocaleDateString();

  return (
    <footer className="footer">
      <div className="container-xl">
        <span>{name}</span>
        <span>{formattedDate}</span>
      </div>
    </footer>
  );
};

export default Footer;
