import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To DeepData Visuals',
  description: 'We give a social media platform for data visualization',
  keywords: 'data, social media, visuals, queries',
};

export default Meta;