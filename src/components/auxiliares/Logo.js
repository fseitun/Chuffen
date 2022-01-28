const apiServerUrl = process.env.REACT_APP_API_SERVER;

const Logo = ({ idSociety }) => (
  <img alt="Logo" height="60px" src={`${apiServerUrl}public/${idSociety?.logo}`} />
);
export default Logo;
